import os
import httpx
from typing import Optional, List, Dict, Any

def get_supabase_config():
    url = (os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")).rstrip("/")
    key = (
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or
        os.environ.get("SUPABASE_ANON_KEY") or
        os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
    )
    return url, key

def is_supabase_configured() -> bool:
    url, key = get_supabase_config()
    return bool(url and key and url.startswith("http"))

def mask_key(val: Optional[str]) -> Optional[str]:
    if not val:
        return None
    val_str = str(val).strip()
    if len(val_str) <= 8:
        return "********"
    return f"{val_str[:4]}...{val_str[-4:]}"


class SupabaseDB:
    """Lightweight, fast async client for Supabase PostgreSQL tables."""

    @staticmethod
    def _headers(key: str, prefer: str = "return=representation") -> Dict[str, str]:
        return {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": prefer
        }

    @classmethod
    async def get_user_keys(cls, user_id: str, mask: bool = True) -> Optional[Dict[str, Any]]:
        url, key = get_supabase_config()
        if not is_supabase_configured() or not user_id:
            return None

        endpoint = f"{url}/rest/v1/user_api_keys?user_id=eq.{user_id}&select=*"
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(endpoint, headers=cls._headers(key))
                if res.status_code == 200:
                    rows = res.json()
                    if rows and len(rows) > 0:
                        row = rows[0]
                        if mask:
                            return {
                                "user_id": row.get("user_id"),
                                "user_email": row.get("user_email"),
                                "has_gemini_key": bool(row.get("gemini_api_key")),
                                "gemini_api_key_masked": mask_key(row.get("gemini_api_key")),
                                "has_epo_key": bool(row.get("epo_consumer_key")),
                                "epo_consumer_key_masked": mask_key(row.get("epo_consumer_key")),
                                "updated_at": row.get("updated_at")
                            }
                        return row
        except Exception as e:
            print(f"[SupabaseDB] get_user_keys error: {e}")
        return None

    @classmethod
    async def save_user_keys(
        cls,
        user_id: str,
        user_email: str = "",
        gemini_api_key: Optional[str] = None,
        epo_consumer_key: Optional[str] = None,
        epo_consumer_secret: Optional[str] = None
    ) -> Dict[str, Any]:
        url, key = get_supabase_config()
        if not is_supabase_configured():
            raise RuntimeError("Supabase credentials not configured in environment (.env).")

        endpoint = f"{url}/rest/v1/user_api_keys"
        payload: Dict[str, Any] = {
            "user_id": user_id,
            "user_email": user_email,
            "updated_at": "now()"
        }
        if gemini_api_key is not None:
            payload["gemini_api_key"] = gemini_api_key.strip()
        if epo_consumer_key is not None:
            payload["epo_consumer_key"] = epo_consumer_key.strip()
        if epo_consumer_secret is not None:
            payload["epo_consumer_secret"] = epo_consumer_secret.strip()

        headers = cls._headers(key, prefer="resolution=merge-duplicates,return=representation")
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.post(endpoint, json=payload, headers=headers)
            if res.status_code in (200, 201):
                rows = res.json()
                if rows:
                    return {
                        "status": "success",
                        "has_gemini_key": bool(rows[0].get("gemini_api_key")),
                        "gemini_api_key_masked": mask_key(rows[0].get("gemini_api_key")),
                        "updated_at": rows[0].get("updated_at")
                    }
                return {"status": "success"}
            raise RuntimeError(f"Supabase upsert failed with status {res.status_code}: {res.text}")

    @classmethod
    async def delete_user_keys(cls, user_id: str) -> bool:
        url, key = get_supabase_config()
        if not is_supabase_configured() or not user_id:
            return False

        endpoint = f"{url}/rest/v1/user_api_keys?user_id=eq.{user_id}"
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.delete(endpoint, headers=cls._headers(key, prefer="return=minimal"))
                return res.status_code in (200, 204)
        except Exception as e:
            print(f"[SupabaseDB] delete_user_keys error: {e}")
            return False

    @classmethod
    async def save_screening_report(
        cls,
        user_id: str,
        title: str,
        domain: str,
        summary: str,
        risk_level: str,
        report_data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        url, key = get_supabase_config()
        if not is_supabase_configured() or not user_id:
            return None

        endpoint = f"{url}/rest/v1/screening_reports"
        payload = {
            "user_id": user_id,
            "title": title or "Untitled Screening",
            "technical_domain": domain or "mechanical",
            "summary": summary or "",
            "risk_level": (risk_level or "MOD").upper(),
            "report_data": report_data
        }

        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                res = await client.post(endpoint, json=payload, headers=cls._headers(key))
                if res.status_code in (200, 201):
                    rows = res.json()
                    return rows[0] if rows else {"status": "success"}
                print(f"[SupabaseDB] save_screening_report status {res.status_code}: {res.text}")
        except Exception as e:
            print(f"[SupabaseDB] save_screening_report error: {e}")
        return None

    @classmethod
    async def get_user_reports(cls, user_id: str, limit: int = 40) -> List[Dict[str, Any]]:
        url, key = get_supabase_config()
        if not is_supabase_configured() or not user_id:
            return []

        endpoint = (
            f"{url}/rest/v1/screening_reports?"
            f"user_id=eq.{user_id}&"
            f"select=id,user_id,title,technical_domain,summary,risk_level,created_at&"
            f"order=created_at.desc&limit={limit}"
        )
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(endpoint, headers=cls._headers(key))
                if res.status_code == 200:
                    return res.json()
                print(f"[SupabaseDB] get_user_reports status {res.status_code}: {res.text}")
        except Exception as e:
            print(f"[SupabaseDB] get_user_reports error: {e}")
        return []

    @classmethod
    async def get_report_by_id(cls, report_id: str, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        url, key = get_supabase_config()
        if not is_supabase_configured() or not report_id:
            return None

        query = f"id=eq.{report_id}"
        if user_id:
            query += f"&user_id=eq.{user_id}"
        endpoint = f"{url}/rest/v1/screening_reports?{query}&select=*"

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(endpoint, headers=cls._headers(key))
                if res.status_code == 200:
                    rows = res.json()
                    return rows[0] if rows else None
        except Exception as e:
            print(f"[SupabaseDB] get_report_by_id error: {e}")
        return None

    @classmethod
    async def delete_report(cls, report_id: str, user_id: str) -> bool:
        url, key = get_supabase_config()
        if not is_supabase_configured() or not report_id or not user_id:
            return False

        endpoint = f"{url}/rest/v1/screening_reports?id=eq.{report_id}&user_id=eq.{user_id}"
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.delete(endpoint, headers=cls._headers(key, prefer="return=minimal"))
                return res.status_code in (200, 204)
        except Exception as e:
            print(f"[SupabaseDB] delete_report error: {e}")
            return False
