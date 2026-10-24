# FastAPI backend and Google Sheets setup

The CrewAI backend sends only completed analysis metadata to a Google Apps Script web app. The script appends that metadata to the teacher-provided spreadsheet. Export is best-effort: it runs after the completed analysis is saved to Supabase, and an Apps Script/network failure does not mark that analysis failed. Results from the frontend's mock/demo mode are not exported.

The Apps Script source is in `google-apps-script/Code.gs`. You will paste it into the Apps Script project opened from the existing spreadsheet.

## 1. Install and start the backend

From the repository root, create/activate your Python virtual environment and install dependencies:

```sh
python -m venv backend/.venv
# Windows PowerShell:
backend/.venv/Scripts/Activate.ps1
# macOS/Linux alternative:
# source backend/.venv/bin/activate
pip install -r backend/requirements.txt
```

Copy `backend/.env.example` to `backend/.env`. Configure the existing Supabase backend URL, service-role key, and model-provider key as required by your setup. These values belong only on the backend. Never use a `VITE_` prefix for them or commit `backend/.env`.

## 2. Add the script to the teacher-provided spreadsheet

1. Open the spreadsheet your teacher provided. Use **Extensions → Apps Script**.
2. In the Apps Script editor, replace the starter contents of `Code.gs` with the complete source from this repository's `google-apps-script/Code.gs`, then save.
3. Return to the spreadsheet and copy its URL. The spreadsheet ID is the text between `/d/` and `/edit`. For example, in `https://docs.google.com/spreadsheets/d/EXAMPLE_ID/edit#gid=0`, the ID is `EXAMPLE_ID`. Do not create a new spreadsheet.
4. In Apps Script, open **Project Settings → Script Properties → Add script property** and add:
   - `SPREADSHEET_ID`: the ID from the existing spreadsheet URL.
   - `SHARED_SECRET`: generate a long, random value and keep it private. Enter the same value in the backend's `GOOGLE_APPS_SCRIPT_SECRET` setting. Do not put the secret in `Code.gs`, the spreadsheet, frontend settings, or Git.
   - Optional `WORKSHEET_NAME`: the exact worksheet tab to use. If omitted, the script uses `Analysis Results`; if that tab does not exist, the script creates a tab in the existing spreadsheet.

Keep the teacher's existing sheet intact. The script writes the header row if the selected worksheet is empty; if a nonempty sheet has different first-row headers, it rejects the append rather than writing columns in the wrong order.

## 3. Deploy the web app

1. In Apps Script, choose **Deploy → New deployment**.
2. Select the gear icon and choose **Web app**.
3. Set **Execute as** to **Me** so the script uses the spreadsheet owner's/editor's permission.
4. For **Who has access**, choose **Anyone** only if your school/account policy permits it. The endpoint needs to accept the backend's unauthenticated HTTPS POST; the signed request body is checked against `SHARED_SECRET`. If your account does not allow public web apps, ask the teacher or Workspace administrator for an approved deployment option before continuing.
5. Deploy, complete Google's authorization prompts, and copy the deployed Web app URL ending in `/exec`.
6. If you later edit the script, update the deployed version from **Deploy → Manage deployments** so the live web app uses the saved code.

The URL identifies the endpoint but is not treated as authentication. Keep the shared secret private. Requests include a timestamp and HMAC-SHA256 signature, and the script rejects requests older than five minutes.

## 4. Configure backend environment

Set these backend-only variables in `backend/.env` for local development or in your hosting provider's secret/environment configuration for deployment:

```dotenv
GOOGLE_APPS_SCRIPT_URL=
GOOGLE_APPS_SCRIPT_SECRET=
```

Put the deployed `/exec` URL in `GOOGLE_APPS_SCRIPT_URL`. Put the exact same private value saved as Apps Script's `SHARED_SECRET` in `GOOGLE_APPS_SCRIPT_SECRET`. Do not paste either value into frontend variables. Restart the backend after changing environment configuration.

No Google service-account JSON or Google API Python package is required. The backend uses its existing `httpx` dependency.

## 5. Test the integration

1. Start the backend from the repository root with `uvicorn backend.main:app --reload` and make sure its existing Supabase and model-provider configuration is valid.
2. Use the app to submit a real resume analysis through the CrewAI backend. Wait until the backend records it as completed.
3. Open the configured worksheet. It should have these columns, in order: `analysis_id`, `user_id`, `job_title`, `company`, `overall_score`, `status`, `completed_at`. A completed real analysis should add one row; the timestamp is UTC ISO 8601. The resume and full report are not sent.
4. For a failure-path check, temporarily use an invalid Apps Script URL or a different backend shared secret, restart the backend, and submit another real analysis. Verify that the analysis remains `completed` in Supabase and no row is added. Restore the correct values afterward. Do not share or paste secret values into logs or messages.
5. Mock/demo frontend results do not call this backend export and should not create a sheet row.

The integration code has not been exercised against your Google deployment or teacher's spreadsheet from this project environment. These steps are the manual end-to-end test.
