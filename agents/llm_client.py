import os
import json
import re
from typing import Optional, Type, TypeVar
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

T = TypeVar("T", bound=BaseModel)


class LLMClient:
    """Free-tier compatible LLM wrapper supporting latest Google Gemini models and deterministic fallback."""

    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        # Default to Google's latest next-gen AI model: gemini-3-flash-preview
        self.model_name = model_name or os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")
        self._genai_client = None
        if self.api_key:
            try:
                from google import genai
                self._genai_client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[LLMClient Init Notice] Could not initialize live GenAI client: {e}")
                self._genai_client = None

    @property
    def is_live(self) -> bool:
        return self._genai_client is not None

    def generate_structured(
        self,
        prompt: str,
        system_instruction: str,
        response_model: Type[T],
        fallback_factory: Optional[callable] = None
    ) -> T:
        """Generate structured Pydantic output using Gemini or fallback."""
        if self._genai_client:
            from google.genai import types

            # Robust candidate cascade: configured primary -> gemini-3-flash-preview -> gemini-2.5-flash
            candidates = [self.model_name]
            if "gemini-3-flash-preview" not in candidates:
                candidates.append("gemini-3-flash-preview")
            if "gemini-2.5-flash" not in candidates:
                candidates.append("gemini-2.5-flash")

            full_prompt = f"{system_instruction}\n\nTask:\n{prompt}\n\nRespond ONLY with a valid JSON object matching the required schema."

            for candidate in candidates:
                try:
                    response = self._genai_client.models.generate_content(
                        model=candidate,
                        contents=full_prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=response_model,
                            temperature=0.2,
                        ),
                    )
                    if response.text:
                        return response_model.model_validate_json(response.text)
                except Exception as e:
                    print(f"[LLMClient Warning] Live Gemini call with '{candidate}' failed ({e}), trying next candidate.")

        if fallback_factory:
            return fallback_factory()

        raise RuntimeError("LLM call failed and no fallback provided.")
