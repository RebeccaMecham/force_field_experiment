// Google Apps Script to accept POSTs and append to a sheet.
// Steps: Create a new Google Sheet, open Tools → Script editor, paste this file,
// replace SHEET_NAME if desired, then Deploy -> New deployment -> Web app (execute as Me, allow Anyone)


const SHEET_NAME = 'Sheet1';


function doPost(e) {
try {
const ss = SpreadsheetApp.getActiveSpreadsheet();
const sh = ss.getSheetByName(SHEET_NAME);
const data = JSON.parse(e.postData.contents);


// Expecting keys: Trial, Time, Accuracy, Error, Timestamp
sh.appendRow([
data.Trial,
data.Time,
data.Accuracy,
data.Error,
data.Time
