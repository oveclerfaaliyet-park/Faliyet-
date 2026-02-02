const SPREADSHEET_ID = "1QaJ0d9STuSCcGawMwCsyE0HRszJxTe5ddKZls-7oz5k"; // E-Tablo ID
const SHEET_NAME = "Sayfa1"; // Sayfa adı

// GET isteği → HTML sayfasını açar
function doGet(e){
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle("Park Faaliyet")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// POST isteği → HTML’den gelen veriyi E-Tablo’ya kaydeder
function doPost(e){
  try {
    if(!e.postData.contents) throw "Boş veri geldi";
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    sheet.appendRow([
      data.tarih || "",
      data.aciklama || "",
      data.resim1 || "",
      data.resim2 || ""
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({status:"success"})
    ).setMimeType(ContentService.MimeType.JSON);

  } catch(err){
    return ContentService.createTextOutput(
      JSON.stringify({status:"error", message: err.toString()})
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test fonksiyonu → Apps Script içinde çalıştır
function testPost() {
  const e = { postData: { contents: JSON.stringify({
    tarih:"2026-02-02",
    aciklama:"Test",
    resim1:"",
    resim2:""
  })}};
  Logger.log(doPost(e).getContent());
}
