/**
 * Receives signed completed-analysis rows from the FastAPI backend and appends
 * them to the teacher-provided spreadsheet. Configure all values in
 * Apps Script > Project Settings > Script Properties; do not put secrets here.
 *
 * Required Script Properties: SPREADSHEET_ID, SHARED_SECRET
 * Optional Script Property: WORKSHEET_NAME (defaults to "Analysis Results")
 */
const HEADERS = [
  "analysis_id",
  "user_id",
  "job_title",
  "company",
  "overall_score",
  "status",
  "completed_at",
];
const MAX_CLOCK_SKEW_SECONDS = 300;

function doPost(e) {
  try {
    const properties = PropertiesService.getScriptProperties();
    const sharedSecret = properties.getProperty("SHARED_SECRET");
    const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
    const worksheetName = properties.getProperty("WORKSHEET_NAME") || "Analysis Results";

    if (!sharedSecret || !spreadsheetId) {
      throw new Error("Apps Script properties are not configured");
    }
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Missing request body");
    }

    const envelope = JSON.parse(e.postData.contents);
    const timestamp = String(envelope.timestamp || "");
    const encodedPayload = String(envelope.payload || "");
    const providedSignature = String(envelope.signature || "").toLowerCase();
    if (!/^\d{10}$/.test(timestamp) || !encodedPayload || !/^[a-f0-9]{64}$/.test(providedSignature)) {
      throw new Error("Invalid request envelope");
    }
    if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > MAX_CLOCK_SKEW_SECONDS) {
      throw new Error("Request timestamp is outside the allowed window");
    }

    const message = Utilities.newBlob(timestamp + "." + encodedPayload).getBytes();
    const expectedSignature = bytesToHex(
      Utilities.computeHmacSha256Signature(message, sharedSecret)
    );
    if (!constantTimeEquals(expectedSignature, providedSignature)) {
      throw new Error("Request authentication failed");
    }

    const paddedPayload = encodedPayload + "=".repeat((4 - (encodedPayload.length % 4)) % 4);
    const payloadBytes = Utilities.base64DecodeWebSafe(paddedPayload);
    const analysis = JSON.parse(Utilities.newBlob(payloadBytes).getDataAsString("UTF-8"));
    validateAnalysis(analysis);

    // Always open the supplied spreadsheet; never create a replacement file.
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    let sheet = spreadsheet.getSheetByName(worksheetName);
    if (!sheet) sheet = spreadsheet.insertSheet(worksheetName);
    ensureHeaders(sheet);

    const values = [
      safeCell(analysis.analysis_id),
      safeCell(analysis.user_id),
      safeCell(analysis.job_title),
      safeCell(analysis.company),
      analysis.overall_score,
      "completed",
      safeCell(analysis.completed_at),
    ];
    sheet.appendRow(values);
    SpreadsheetApp.flush();

    return jsonResponse({ ok: true });
  } catch (error) {
    // Do not include request values or secret data in responses/logs.
    console.error("Analysis export rejected or failed: " + error.name);
    return jsonResponse({ ok: false, error: "Request rejected or append failed" });
  }
}

function validateAnalysis(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid analysis row");
  }
  ["analysis_id", "user_id", "job_title", "company", "status", "completed_at"].forEach(function (key) {
    if (typeof value[key] !== "string") throw new Error("Invalid analysis field");
  });
  if (!value.analysis_id || !value.user_id || !value.job_title || !value.completed_at) {
    throw new Error("Required analysis field is empty");
  }
  if (value.status !== "completed") throw new Error("Only completed results can be exported");
  if (typeof value.overall_score !== "number" || !Number.isInteger(value.overall_score) ||
      value.overall_score < 0 || value.overall_score > 100) {
    throw new Error("Invalid overall score");
  }
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }
  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  if (HEADERS.some(function (header, index) { return existing[index] !== header; })) {
    throw new Error("Worksheet header row does not match the expected columns");
  }
}

function safeCell(value) {
  const text = String(value);
  // Prevent formula execution for user-provided text while preserving display.
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function bytesToHex(bytes) {
  return bytes.map(function (byte) {
    const unsignedByte = (byte + 256) % 256;
    return (unsignedByte < 16 ? "0" : "") + unsignedByte.toString(16);
  }).join("");
}

function constantTimeEquals(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index++) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
