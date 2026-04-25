// ============================================================
// IRIS Talent Mapping — Google Apps Script Backend
// Deploy as: Web App > Execute as: Me > Who has access: Anyone
// ============================================================

const SHEET_NAME = "Data";
const HEADERS = ["Timestamp", "Divisi", "Nama", "Kategori", "Kategori Lomba", "Nama Lomba", "Juara"];

function doGet(e) {
  const action = e.parameter.action || "getData";
  let result;
  try {
    if (action === "getData") result = getData();
    else if (action === "getStats") result = getStats();
    else result = { error: "Unknown action" };
  } catch (err) {
    result = { error: err.message };
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let result;
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === "addEntry") result = addEntry(data.payload);
    else if (data.action === "addEntries") result = addEntries(data.payload);
    else if (data.action === "deleteEntry") result = deleteEntry(data.rowIndex);
    else result = { error: "Unknown action" };
  } catch (err) {
    result = { error: err.message };
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setBackground("#1a56db")
      .setFontColor("#ffffff")
      .setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getData() {
  const sheet = getOrCreateSheet();
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return { entries: [] };
  const headers = rows[0];
  const entries = rows.slice(1).map((row, i) => {
    const obj = { rowIndex: i + 2 };
    headers.forEach((h, j) => obj[h] = row[j]);
    return obj;
  });
  return { entries };
}

function addEntry(payload) {
  const sheet = getOrCreateSheet();
  const ts = new Date().toISOString();
  sheet.appendRow([
    ts,
    payload.divisi || "",
    payload.nama || "",
    payload.kategori || "",
    payload.katLomba || "",
    payload.namaLomba || "",
    payload.juara || ""
  ]);
  return { success: true, timestamp: ts };
}

function addEntries(payloadArray) {
  const sheet = getOrCreateSheet();
  const ts = new Date().toISOString();
  if (Array.isArray(payloadArray) && payloadArray.length > 0) {
    const rows = payloadArray.map(payload => [
      ts,
      payload.divisi || "",
      payload.nama || "",
      payload.kategori || "",
      payload.katLomba || "",
      payload.namaLomba || "",
      payload.juara || ""
    ]);
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    return { success: true, timestamp: ts, count: rows.length };
  }
  return { error: "Invalid payload" };
}

function deleteEntry(rowIndex) {
  const sheet = getOrCreateSheet();
  sheet.deleteRow(Number(rowIndex));
  return { success: true };
}

function getStats() {
  const { entries } = getData();
  const stats = {
    total: entries.length,
    wins: entries.filter(e => e["Kategori"] === "Menang").length,
    uniqueMembers: [...new Set(entries.map(e => e["Nama"]))].length,
    uniqueLomba: [...new Set(entries.map(e => e["Nama Lomba"]))].length,
    byDivisi: {},
    byKatLomba: { "Antar Universitas": 0, "Nasional": 0, "Internasional": 0 },
    recentEntries: entries.slice(-5).reverse()
  };
  entries.forEach(e => {
    const div = e["Divisi"];
    const kat = e["Kategori Lomba"];
    stats.byDivisi[div] = (stats.byDivisi[div] || 0) + 1;
    if (stats.byKatLomba[kat] !== undefined) stats.byKatLomba[kat]++;
  });
  return stats;
}
