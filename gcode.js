// Main function that sends the email after all the data is collected
function sendEmail(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var html = HtmlService.createTemplateFromFile('email').evaluate();
  var htmlContent = html.getContent();

  MailApp.sendEmail(
    'jbell0385@gmail.com',
    "Daily Subway Digest",
    "Daily Subway Digest",
    {htmlBody:htmlContent}
  )
}

//This function is used in email.html.  It goes into the spreadsheet and grabs all the data needed to build the email.
function getEmailData(){
  var theData = {};
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetCashIn = ss.getSheetByName("cash-in-report");
  var sheetSales = ss.getSheetByName("sales");
  var sheetUnits = ss.getSheetByName("units");
  var sheetProductivity = ss.getSheetByName("productivity");
  var sheetHours = ss.getSheetByName("hours");
  
  var lrCashIn = sheetCashIn.getLastRow();
  var lrSales = sheetSales.getLastRow();
  var lrUnits = sheetUnits.getLastRow();
  var lrProductivity = sheetProductivity.getLastRow();
  var lrHours = sheetHours.getLastRow();
  
  var daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday",'Friday',"Saturday"];
  var date = sheetCashIn.getRange(lrCashIn, 1).getValue();
  theData.date = daysOfWeek[date.getDay()] + " " + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
  theData.paidouts = sheetCashIn.getRange(lrCashIn, 3).getValue();
  theData.proceeds = sheetCashIn.getRange(lrCashIn, 4).getValue();
  theData.cashDrawer = sheetCashIn.getRange(lrCashIn, 5).getValue();
  theData.dispenser = sheetCashIn.getRange(lrCashIn, 6).getValue();
  theData.changeFund = sheetCashIn.getRange(lrCashIn, 7).getValue();
  theData.moneyOverShort = sheetCashIn.getRange(lrCashIn, 8).getValue();
  theData.subBreadOverShort = sheetCashIn.getRange(lrCashIn, 9).getValue();
  theData.flatBreadOverShort = sheetCashIn.getRange(lrCashIn, 10).getValue();
  theData.saladOverShort = sheetCashIn.getRange(lrCashIn, 11).getValue();
  theData.otherOverShort = sheetCashIn.getRange(lrCashIn, 12).getValue();
  theData.productivity = sheetProductivity.getRange(lrProductivity,3).getValue();
  theData.drops = sheetCashIn.getRange(lrCashIn, 13).getValue();
  theData.salesOverTime = "https://image-charts.com/chart?chtt=Sales+During+Each+Hour&chg=0,20&chxt=x,y&chs=900x500&cht=bvs&chd=a:"+
    sheetSales.getRange(lrSales,6).getValue()+","+
    sheetSales.getRange(lrSales,7).getValue()+","+
    sheetSales.getRange(lrSales,8).getValue() + "," +
    sheetSales.getRange(lrSales,10).getValue() + "," +
    sheetSales.getRange(lrSales,11).getValue()+","+
    sheetSales.getRange(lrSales,12).getValue()+","+
    sheetSales.getRange(lrSales,14).getValue()+","+
    sheetSales.getRange(lrSales,15).getValue()+","+
    sheetSales.getRange(lrSales,16).getValue()+","+
    sheetSales.getRange(lrSales,18).getValue()+","+
    sheetSales.getRange(lrSales,19).getValue()+","+
    sheetSales.getRange(lrSales,20).getValue()+","+
    sheetSales.getRange(lrSales,22).getValue()+
    "&chxl=0:|8-9A|9-10A|10-11A|11-12P|12-1P|1-2P|2-3P|3-4P|4-5P|5-6P|6-7P|7-8P|8-9P"
    
  theData.productivityOverTime = "https://image-charts.com/chart?chtt=Productivity+During+Each+Hour&chg=0,20&chxt=x,y&chs=900x500&cht=bvs&chco=4D89F9&chd=a:"+
    sheetProductivity.getRange(lrProductivity,6).getValue()+","+
    sheetProductivity.getRange(lrProductivity,7).getValue()+","+
    sheetProductivity.getRange(lrProductivity,8).getValue() + "," +
    sheetProductivity.getRange(lrProductivity,10).getValue() + "," +
    sheetProductivity.getRange(lrProductivity,11).getValue()+","+
    sheetProductivity.getRange(lrProductivity,12).getValue()+","+
    sheetProductivity.getRange(lrProductivity,14).getValue()+","+
    sheetProductivity.getRange(lrProductivity,15).getValue()+","+
    sheetProductivity.getRange(lrProductivity,16).getValue()+","+
    sheetProductivity.getRange(lrProductivity,18).getValue()+","+
    sheetProductivity.getRange(lrProductivity,19).getValue()+","+
    sheetProductivity.getRange(lrProductivity,20).getValue()+","+
    sheetProductivity.getRange(lrProductivity,22).getValue()+
    "&chxl=0:|8-9A|9-10A|10-11A|11-12P|12-1P|1-2P|2-3P|3-4P|4-5P|5-6P|6-7P|7-8P|8-9P"
  
  Logger.log(theData.productivityOverTime);

  return theData;
}

//Main function that runs the two API calls 
function getAllData(){
  getCashInReport();
  getSalesData();
  sendEmail();
}

function getSalesData() {
  var response = UrlFetchApp.fetch("https://subway-data.herokuapp.com/get-sales");
  var json = response.getContentText();
  var data = JSON.parse(json);
  inputSalesData(data);
  Logger.log(data);
}

function inputSalesData(data){
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.insertSheet('daily-sales-raw');
  var sheet = ss.getSheetByName("daily-sales-raw");
  Logger.log(data);

  var salesData = [];
  
  
  for (var i=0; i<data.length;i++){
    var range = sheet.getRange(i+1,1,1,data[i].length);
    range.setValues([data[i]]);
  }
  
  function setSalesData(cell){
    if(sheet.getRange(cell).getValue()==="-"){
      salesData.push(0);
    }else{
      salesData.push(sheet.getRange(cell).getValue());
    }
  }
  
  //Input values into sales sheet 
  setSalesData("m3");  
  setSalesData("m4");
  setSalesData("m5");
  setSalesData("m6");
  setSalesData("m7");
  setSalesData("m8");
  setSalesData("m9");
  setSalesData("m10");
  setSalesData("m11");
  setSalesData("m12");
  setSalesData("m13");
  setSalesData("m14");
  setSalesData("m15");
  setSalesData("m16");
  setSalesData("m17");
  setSalesData("m18");
  setSalesData("m19");
  setSalesData("m20");
  setSalesData("m21");
  setSalesData("m22");
  setSalesData("m23");
  setSalesData("m24");
  setSalesData("m25");
  setSalesData("m26");
  setSalesData("m27");
  setSalesData("m28");
  setSalesData("m29");
  setSalesData("m30");
  setSalesData("m31");
  setSalesData("m32");
  setSalesData("m33");
  var salesSheet = ss.getSheetByName("sales");
  var salesSheetRange = salesSheet.getRange(salesSheet.getLastRow(), 3,1,31);
  salesSheetRange.setValues([salesData]);
  
  //Input values into productivity
  salesData = [];
  setSalesData("l3");  
  setSalesData("l4");
  setSalesData("l5");
  setSalesData("l6");
  setSalesData("l7");
  setSalesData("l8");
  setSalesData("l9");
  setSalesData("l10");
  setSalesData("l11");
  setSalesData("l12");
  setSalesData("l13");
  setSalesData("l14");
  setSalesData("l15");
  setSalesData("l16");
  setSalesData("l17");
  setSalesData("l18");
  setSalesData("l19");
  setSalesData("l20");
  setSalesData("l21");
  setSalesData("l22");
  setSalesData("l23");
  setSalesData("l24");
  setSalesData("l25");
  setSalesData("l26");
  setSalesData("l27");
  setSalesData("l28");
  setSalesData("l29");
  setSalesData("l30");
  setSalesData("l31");
  setSalesData("l32");
  setSalesData("l33");
  var productivitySheet = ss.getSheetByName("productivity");
  var productivitySheetRange = productivitySheet.getRange(productivitySheet.getLastRow(), 3,1,31);
  productivitySheetRange.setValues([salesData]);
  
  //Input values into hours
  salesData = [];
  setSalesData("k3");  
  setSalesData("k4");
  setSalesData("k5");
  setSalesData("k6");
  setSalesData("k7");
  setSalesData("k8");
  setSalesData("k9");
  setSalesData("k10");
  setSalesData("k11");
  setSalesData("k12");
  setSalesData("k13");
  setSalesData("k14");
  setSalesData("k15");
  setSalesData("k16");
  setSalesData("k17");
  setSalesData("k18");
  setSalesData("k19");
  setSalesData("k20");
  setSalesData("k21");
  setSalesData("k22");
  setSalesData("k23");
  setSalesData("k24");
  setSalesData("k25");
  setSalesData("k26");
  setSalesData("k27");
  setSalesData("k28");
  setSalesData("k29");
  setSalesData("k30");
  setSalesData("k31");
  setSalesData("k32");
  setSalesData("k33");
  var hoursSheet = ss.getSheetByName("hours");
  var hoursSheetRange = hoursSheet.getRange(hoursSheet.getLastRow(), 3,1,31);
  hoursSheetRange.setValues([salesData]);
  
  //Input values into units
  salesData = [];
  setSalesData("j3");  
  setSalesData("j4");
  setSalesData("j5");
  setSalesData("j6");
  setSalesData("j7");
  setSalesData("j8");
  setSalesData("j9");
  setSalesData("j10");
  setSalesData("j11");
  setSalesData("j12");
  setSalesData("j13");
  setSalesData("j14");
  setSalesData("j15");
  setSalesData("j16");
  setSalesData("j17");
  setSalesData("j18");
  setSalesData("j19");
  setSalesData("j20");
  setSalesData("j21");
  setSalesData("j22");
  setSalesData("j23");
  setSalesData("j24");
  setSalesData("j25");
  setSalesData("j26");
  setSalesData("j27");
  setSalesData("j28");
  setSalesData("j29");
  setSalesData("j30");
  setSalesData("j31");
  setSalesData("j32");
  setSalesData("j33");
  var unitsSheet = ss.getSheetByName("units");
  var unitsSheetRange = unitsSheet.getRange(unitsSheet.getLastRow(), 3,1,31);
  unitsSheetRange.setValues([salesData]);
  
  ss.deleteSheet(ss.getSheetByName('daily-sales-raw'));
  
}

function getCashInReport(){
  var response = UrlFetchApp.fetch("https://subway-data.herokuapp.com/get-cash-report");
  var json = response.getContentText();
  var data = JSON.parse(json);
  inputCashInData(data);
}

function inputCashInData(data){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday",'Friday',"Saturday"];
  
  var overShortData = {
    "DATE":"",
    "DAY":"",
    "PAIDOUTS":"",
    "PROCEEDS":"",
    "CASH DRAWER":"",
    "DISPENSER":"",
    "CHANGE FUND":"",
    "MONEY OVER SHORT":"",
    "SUB BREAD OVER SHORT":"",
    "FLAT BREAD OVER SHORT":"",
    "SALAD OVER SHORT":"",
    "OTHER OVER SHORT":"",
    "DROPS":""
  };
  
  for(var i=0;i<data.length;i++){
    for(var j=0; j<data[i].length;j++){
      switch(data[i][j]){
        case "Date:":
          overShortData["DATE"] =data[i][j+1];
          var date = new Date(data[i][j+1]);
          overShortData["DAY"] = daysOfWeek[date.getDay()];
          break;
          
        case "PAIDOUTS":
          overShortData["PAIDOUTS"] = data[i][j+1];
          break;
          
        case "PROCEEDS":
          overShortData["PROCEEDS"] = data[i][j+1];
          break;
          
        case "DISPENSER":
          overShortData["DISPENSER"] = data[i][j+1];
          break;
          
        case "FUND":
          overShortData["CHANGE FUND"] = data[i][j+1];
          break;
          
        case "DRAWER":
          overShortData["CASH DRAWER"] = data[i][j+1];
          break;
          
        case "OVER":
          if(data[i][j+1]==="/" && data[i][j+2]==="SHORT"){
            overShortData["MONEY OVER SHORT"] = data[i][j+3];
          }
          break;
          
        case "SUB":
          overShortData["SUB BREAD OVER SHORT"] = data[i+1][j+1];
          break;
          
        case "FLAT":
          overShortData["FLAT BREAD OVER SHORT"] = data[i+1][j+1];
          break;
          
        case "SALAD":
          overShortData["SALAD OVER SHORT"] = data[i+1][j+1];
          break;
          
        case "OTHER":
          if(data[i][j+1] === "LEFT"){
            overShortData["OTHER OVER SHORT"] = data[i+1][j+1]; 
          }
          break;
          
        case "DROPS":
          overShortData["DROPS"] = data[i][j+1];
          break;
      }
    }
  }
  

  var cashInReportSheet = ss.getSheetByName('cash-in-report');
  var cashInReportLastRow = cashInReportSheet.getLastRow();
  var cashInReportHeaders = cashInReportSheet.getRange(1,1,1, cashInReportSheet.getLastColumn()).getValues()[0];

  for(var i=0;i<cashInReportHeaders.length;i++){
    var range = cashInReportSheet.getRange(cashInReportLastRow+1,i+1);
    range.setValue(overShortData[cashInReportHeaders[i]]);
  }
  
  ss.getSheetByName("sales").getRange(cashInReportLastRow+1, 1).setValue(overShortData["DATE"]);
  ss.getSheetByName("sales").getRange(cashInReportLastRow+1, 2).setValue(overShortData["DAY"]);
  ss.getSheetByName("units").getRange(cashInReportLastRow+1, 1).setValue(overShortData["DATE"]);
  ss.getSheetByName("units").getRange(cashInReportLastRow+1, 2).setValue(overShortData["DAY"]);
  ss.getSheetByName("productivity").getRange(cashInReportLastRow+1, 1).setValue(overShortData["DATE"]);
  ss.getSheetByName("productivity").getRange(cashInReportLastRow+1, 2).setValue(overShortData["DAY"]);
  ss.getSheetByName("hours").getRange(cashInReportLastRow+1, 1).setValue(overShortData["DATE"]);
  ss.getSheetByName("hours").getRange(cashInReportLastRow+1, 2).setValue(overShortData["DAY"]);
}

function getWisrReport(){
  var response = UrlFetchApp.fetch("https://subway-data.herokuapp.com/get-wisr");
  var json = response.getContentText();
  var data = JSON.parse(json);
  inputWisrReport(data);
}

function inputWisrReport(data){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.insertSheet('wisr-raw');
  var sheet = ss.getSheetByName("wisr-raw");
  Logger.log(data);

  var wisrData = [];
  
  for (var i=0; i<data.length;i++){
    var range = sheet.getRange(i+1,1,1,data[i].length);
    range.setValues([data[i]]);
  }
}


