# Google Sheets Setup

This project sends RSVP responses to Google Sheets through a simple Google Apps Script Web App.

## Sheet Columns

The guest sheet keeps the current fields `Fecha, Nombre, Asistencia, Acompañantes, Detalle`. The script adds `ID de respuesta` in the first available column after those fields. The food sheet keeps `Fecha, Nombre, Restricciones, Detalle` and also gets an `ID de respuesta` column. Existing rows are not rewritten.

## Apps Script

In the Apps Script project, replace the existing code with the complete code below. It keeps the current first five columns in the guest sheet and first four columns in the food sheet, then adds a request ID column used to confirm a save and prevent duplicate rows on retries.

```js
const GUESTS_SPREADSHEET_ID = "1KjBez7o3S1yBuVrS4Hf5jc2iH76gSoHIYUPLUV41dTA";
const DIET_SPREADSHEET_ID = "1F9MNGtmHF48Df66i1z6vIo2_CpdEQYsOxmhfC94MhUs";

function doPost(e) {
  const lock = LockService.getScriptLock();
  let lockAcquired = false;

  try {
    lock.waitLock(30000);
    lockAcquired = true;

    const data = e && e.parameter ? e.parameter : {};
    const requestId = String(data.requestId || "").trim();
    if (!requestId) throw new Error("Missing requestId parameter.");

    const name = String(data.name || "").trim();
    const attendance = String(data.attendance || "").trim();
    const companions = String(data.companions || "0");
    const dietary = String(data.dietary || "").trim();
    const details = String(data.details || "").trim();
    const timestamp = new Date();

    const guestsSheet = getFirstSheet_(GUESTS_SPREADSHEET_ID);
    const guestsIdColumn = getRequestIdColumn_(guestsSheet, 6);

    if (!hasRequestId_(guestsSheet, guestsIdColumn, requestId)) {
      appendWithRequestId_(guestsSheet, guestsIdColumn, [timestamp, name, attendance, companions, details], requestId);
    }

    const requiresDietRecord = Boolean(dietary || details);
    if (requiresDietRecord) {
      const dietSheet = getFirstSheet_(DIET_SPREADSHEET_ID);
      const dietIdColumn = getRequestIdColumn_(dietSheet, 5);

      if (!hasRequestId_(dietSheet, dietIdColumn, requestId)) {
        appendWithRequestId_(dietSheet, dietIdColumn, [timestamp, name, dietary, details], requestId);
      }
    }

    SpreadsheetApp.flush();
    return jsonOutput_({ ok: true, requestId: requestId });
  } catch (error) {
    Logger.log("ERROR doPost: " + (error && error.stack ? error.stack : error));
    return jsonOutput_({ ok: false });
  } finally {
    if (lockAcquired) lock.releaseLock();
  }
}

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const callback = String(params.callback || "");

  if (!/^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService
      .createTextOutput("/* Invalid callback */")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  if (String(params.action || "") !== "verify") {
    return jsonpOutput_(callback, { exists: false });
  }

  try {
    const requestId = String(params.requestId || "").trim();
    if (!requestId) return jsonpOutput_(callback, { exists: false });

    const guestsSheet = getFirstSheet_(GUESTS_SPREADSHEET_ID);
    const guestsIdColumn = getRequestIdColumn_(guestsSheet, 6);
    const guestExists = hasRequestId_(guestsSheet, guestsIdColumn, requestId);

    const requiresDietRecord = String(params.requiresDietRecord || "") === "true";
    let dietExists = true;
    if (requiresDietRecord) {
      const dietSheet = getFirstSheet_(DIET_SPREADSHEET_ID);
      const dietIdColumn = getRequestIdColumn_(dietSheet, 5);
      dietExists = hasRequestId_(dietSheet, dietIdColumn, requestId);
    }

    return jsonpOutput_(callback, { exists: guestExists && dietExists });
  } catch (error) {
    Logger.log("ERROR doGet verify: " + (error && error.stack ? error.stack : error));
    return jsonpOutput_(callback, { exists: false });
  }
}

function getFirstSheet_(spreadsheetId) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheets()[0];
  if (!sheet) throw new Error("No sheets found in spreadsheet " + spreadsheetId);
  return sheet;
}

function getRequestIdColumn_(sheet, minimumColumn) {
  const width = Math.max(sheet.getLastColumn(), minimumColumn);
  const headers = sheet.getRange(1, 1, 1, width).getDisplayValues()[0];
  const existingColumn = headers.findIndex((value) => String(value).trim() === "ID de respuesta");
  if (existingColumn >= 0) return existingColumn + 1;

  let column = headers.findIndex(
    (value, index) => index + 1 >= minimumColumn && !String(value).trim(),
  ) + 1;
  if (column < minimumColumn) column = Math.max(sheet.getLastColumn() + 1, minimumColumn);

  sheet.getRange(1, column).setValue("ID de respuesta");
  return column;
}

function hasRequestId_(sheet, column, requestId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const values = sheet.getRange(2, column, lastRow - 1, 1).getDisplayValues();
  return values.some((row) => String(row[0]).trim() === requestId);
}

function appendWithRequestId_(sheet, requestIdColumn, values, requestId) {
  const row = values.slice();
  while (row.length < requestIdColumn) row.push("");
  row[requestIdColumn - 1] = requestId;
  sheet.appendRow(row);
}

function jsonOutput_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonpOutput_(callback, value) {
  return ContentService
    .createTextOutput(callback + "(" + JSON.stringify(value) + ");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
```

The request ID is appended in a new column named `ID de respuesta` in each sheet that receives a row. Existing columns and rows are preserved.

After replacing the code, save it and update the active Web App deployment to a new version. Keep the access setting as `Anyone` and execution as your account. Confirm that Vercel's `VITE_GOOGLE_SCRIPT_URL` points to that active deployment, then redeploy the Vercel app so its built configuration uses the updated endpoint.

## AI Studio Variables

Set these variables before publishing:

```text
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_ADMIN_KEY=choose-a-private-key
```

Guest links:

```text
https://your-app.ai.studio/?inv=1
https://your-app.ai.studio/?inv=2
```

Private summary link:

```text
https://your-app.ai.studio/?admin=choose-a-private-key
```
