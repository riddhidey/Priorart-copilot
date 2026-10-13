import os
import json
import re
import time
from typing import Optional, Type, TypeVar
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

T = TypeVar("T", bound=BaseModel)

# Global rate-limit cooldown to avoid serial 429 Resource Exhausted timeouts across multiple agent steps
_QUOTA_COOLDOWN_UNTIL: float = 0.0


def _is_rate_limited() -> bool:
    """Check if the global rate-limit circuit breaker is currently active."""
    return time.time() < _QUOTA_COOLDOWN_UNTIL


def _trigger_cooldown(seconds: float = 25.0):
    """Activate cooldown circuit breaker for all subsequent calls when a 429 quota error occurs."""
    global _QUOTA_COOLDOWN_UNTIL
    _QUOTA_COOLDOWN_UNTIL = max(_QUOTA_COOLDOWN_UNTIL, time.time() + seconds)


class LLMClient:
    """Free-tier compatible LLM wrapper supporting latest Google Gemini models and deterministic fallback."""

    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        # Read API key from parameter or environment variable (.env)
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        # Default to Google's latest next-gen AI model: gemini-3-flash-preview
        self.model_name = model_name or os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")
        self._genai_client = None
        
        # Initialize official Google GenAI SDK client if API key is provided
        if self.api_key:
            try:
                from google import genai
                self._genai_client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[LLMClient Init Notice] Could not initialize live GenAI client: {e}")
                self._genai_client = None

    @property
    def is_live(self) -> bool:
        """Returns True if the client is initialized with an API key and is not on cooldown."""
        return self._genai_client is not None and not _is_rate_limited()

    def generate_structured(
        self,
        prompt: str,
        system_instruction: str,
        response_model: Type[T],
        fallback_factory: Optional[callable] = None
    ) -> T:
        """Generate structured Pydantic output using Gemini or deterministic offline fallback."""
        
        # Fast-Path: If quota was recently exhausted (429), immediately use fallback without freezing
        if _is_rate_limited():
            if fallback_factory:
                return fallback_factory()

        if self._genai_client:
            from google.genai import types

            # Robust candidate cascade: tries primary configured model -> gemini-3-flash-preview -> gemini-2.5-flash
            candidates = [self.model_name]
            if "gemini-3-flash-preview" not in candidates:
                candidates.append("gemini-3-flash-preview")
            if "gemini-2.5-flash" not in candidates:
                candidates.append("gemini-2.5-flash")

            full_prompt = f"{system_instruction}\n\nTask:\n{prompt}\n\nRespond ONLY with a valid JSON object matching the required schema."

            for candidate in candidates:
                try:
                    # Enforce strict JSON schema validation matching the Pydantic response_model
                    response = self._genai_client.models.generate_content(
                        model=candidate,
                        contents=full_prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=response_model,
                            temperature=0.2,  # Low temperature for factual, legal-style precision
                        ),
                    )
                    if response.text:
                        # Parse and return validated Pydantic model
                        return response_model.model_validate_json(response.text)
                except Exception as e:
                    err_str = str(e).lower()
                    # If 429 quota exhaustion is detected, activate circuit breaker and switch to offline fallback
                    if "429" in err_str or "resource_exhausted" in err_str:
                        _trigger_cooldown(25.0)
                        print(f"[LLMClient Rate-Limit] Model '{candidate}' hit 429 quota, activating {25}s circuit breaker.")
                        break
                    print(f"[LLMClient Warning] Live Gemini call with '{candidate}' failed ({e}), trying next candidate.")

        # If LLM failed, API key is missing, or quota was hit: call the deterministic offline fallback
        if fallback_factory:
            return fallback_factory()

        raise RuntimeError("LLM call failed and no fallback provided.")
