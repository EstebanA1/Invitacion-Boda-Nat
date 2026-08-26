# Google Sheets Setup

This project sends RSVP responses to Google Sheets through a simple Google Apps Script Web App.

## Sheet Columns

Create a Google Sheet with these headers in the first row:

```text
Fecha,Nombre,Asistencia,Acompañantes,Total personas,Teléfono,Restricciones,Mensaje,Invitación
```

## Apps Script

Open `Extensiones > Apps Script` in the Google Sheet, paste this code, save it, and deploy it as a Web App with access set to `Anyone`.

```js
const SHEET_NAME = "Respuestas";

function doPost(e) {
  const sheet = getSheet_();
  const data = e.parameter || {};

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.attendance || "",
    data.companions || "0",
    data.totalPeople || "0",
    data.phone || "",
    data.dietary || "",
    data.details || "",
    data.invitationType || "1",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const callback = e.parameter.callback || "callback";
  const action = e.parameter.action || "";

  if (action !== "list") {
    return ContentService
      .createTextOutput(`${callback}(${JSON.stringify({ guests: [] })})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  const rows = getSheet_().getDataRange().getValues().slice(1).reverse();
  const guests = rows.map((row, index) => ({
    id: `${row[0]}-${index}`,
    createdAt: row[0],
    name: row[1],
    attendance: row[2],
    companions: Number(row[3] || 0),
    phone: row[5] || "",
    dietary: String(row[6] || "").split(",").map((item) => item.trim()).filter(Boolean),
    details: row[7] || "",
    invitationType: String(row[8] || "1"),
    isSynced: true,
  }));

  return ContentService
    .createTextOutput(`${callback}(${JSON.stringify({ guests })})`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Fecha",
      "Nombre",
      "Asistencia",
      "Acompañantes",
      "Total personas",
      "Teléfono",
      "Restricciones",
      "Mensaje",
      "Invitación",
    ]);
  }

  return sheet;
}
```

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
