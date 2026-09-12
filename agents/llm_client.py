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
    """Free-tier compatible LLM wrapper supporting Google Gemini and deterministic fallback."""

    def __init__(self, api_key: Optional[str] = None, model_name: str = "gemini-2.5-flash"):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = model_name
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
            try:
                from google.genai import types
                full_prompt = f"{system_instruction}\n\nTask:\n{prompt}\n\nRespond ONLY with a valid JSON object matching the required schema."
                
                response = self._genai_client.models.generate_content(
                    model=self.model_name,
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
                # Log or print warning and fall through to fallback if provided
                print(f"[LLMClient Warning] Live Gemini call failed ({e}), falling back to deterministic agent engine.")

        if fallback_factory:
            return fallback_factory()

        raise RuntimeError("LLM call failed and no fallback provided.")
