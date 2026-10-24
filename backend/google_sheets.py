"""Best-effort export of completed analysis metadata to Google Apps Script."""

import base64
import hashlib
import hmac
import json
import logging
import os
import time
from typing import Any

import httpx

logger = logging.getLogger("resume-reviewer.google-sheets")


def append_completed_analysis(analysis: dict[str, Any]) -> bool:
    """POST a signed row to Apps Script. Export failures never escape."""
    url = os.getenv("GOOGLE_APPS_SCRIPT_URL", "").strip()
    secret = os.getenv("GOOGLE_APPS_SCRIPT_SECRET", "").strip()
    analysis_id = str(analysis.get("analysis_id", "unknown"))

    if not url or not secret:
        logger.info("Apps Script export skipped: backend configuration is incomplete.")
        return False

    if analysis.get("status") != "completed":
        logger.info("Apps Script export skipped for non-completed analysis %s.", analysis_id)
        return False

    row = {
        "analysis_id": analysis_id,
        "user_id": str(analysis.get("user_id", "")),
        "job_title": str(analysis.get("job_title", "")),
        "company": str(analysis.get("company") or ""),
        "overall_score": analysis.get("overall_score"),
        "status": "completed",
        "completed_at": str(analysis.get("completed_at", "")),
    }

    try:
        serialized = json.dumps(row, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        encoded_payload = base64.urlsafe_b64encode(serialized).decode("ascii").rstrip("=")
        timestamp = str(int(time.time()))
        signed_message = f"{timestamp}.{encoded_payload}".encode("ascii")
        signature = hmac.new(secret.encode("utf-8"), signed_message, hashlib.sha256).hexdigest()

        response = httpx.post(
            url,
            json={"timestamp": timestamp, "payload": encoded_payload, "signature": signature},
            timeout=10.0,
            follow_redirects=True,
        )
        response.raise_for_status()
        result = response.json()
        if not isinstance(result, dict) or result.get("ok") is not True:
            raise ValueError("Apps Script did not confirm the append")

        logger.info("Exported completed analysis %s to Apps Script.", analysis_id)
        return True
    except Exception as exc:
        # Avoid logging request bodies, credentials, signatures, or response text.
        logger.warning(
            "Apps Script export failed for analysis %s (%s); analysis remains completed.",
            analysis_id,
            type(exc).__name__,
        )
        return False
