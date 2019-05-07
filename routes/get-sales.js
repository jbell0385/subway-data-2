require("dotenv").config();
var express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");

router.get("/get-sales", function(req, res, next) {
  (async () => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto("https://liveiq.subway.com");
    await page.waitForSelector("#signInName");
    await page.type("#signInName", process.env.SUBWAY_USER);
    await page.type("#password", process.env.SUBWAY_PASS);
    await page.click("#next");

    await page.waitForSelector(
      ".entity-arrow.group-store-date a i.fa.fa-chevron-down",
      {
        visible: true,
        timeout: 10000
      }
    );
    await page.waitForSelector("table.px-table.store-readings", {
      visible: true
    });
    await page.click(".entity-arrow.group-store-date a i.fa.fa-chevron-down");
    await page.waitForSelector("#navbar-entity-wrapper");
    await page.evaluate(() => {
      document.querySelector("#navbar-entity-wrapper").style.visibility =
        "visible";
    });
    await page.waitForSelector("#entityselectorButton");
    await page.click("#entityselectorButton");
    await page.waitForSelector(
      "[id='hTvox4LiGfw%3D_store_18426_12%2F1%2F2014%2012%3A00%3A00%20AM']"
    );
    await page.click(
      "[id='hTvox4LiGfw%3D_store_18426_12%2F1%2F2014%2012%3A00%3A00%20AM']"
    );
    await page.waitForSelector("table.px-table.store-readings", {
      visible: true
    });
    await page.waitForSelector(".bottom.all-stores", {
      visible: true
    });

    //   await page.waitFor(2000);
    const storeReadings = await page.evaluate(() => {
      const table = document.querySelector("table.px-table.store-readings");
      const finalArr = [];
      Array.from(table.rows).forEach((row, i) => {
        let tempArr = [];
        Array.from(row.cells).forEach(cell => {
          var cleanText = cell.innerText.replace(/(\r\n|\n|\r)/gm, "");
          tempArr.push(cleanText);
        });
        finalArr.push(tempArr);
      });
      return finalArr;
    });

    console.log(storeReadings);
    await browser.close();
    res.send(storeReadings);
  })();
});

router.get("/get-cash-report", function(req, res, next) {
  (async () => {
    const browser = await puppeteer.launch({
      // headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto("https://liveiq.subway.com");
    await page.waitForSelector("#signInName");
    await page.type("#signInName", process.env.SUBWAY_USER);
    await page.type("#password", process.env.SUBWAY_PASS);
    await page.click("#next");
    console.log("made it to page");
    await page.waitForSelector("#menu-item-tab-reprep", {
      visible: true
    });
    await page.waitForSelector("tr.alt.bottom", {
      visible: true
    });
    await page.click("#menu-item-tab-reprep");
    console.log("clicked reports button");
    await page.waitForFunction(
      'document.querySelector("#menu-item-tab-reprep").classList.contains("open")'
    );
    await page.waitForSelector("#sub-item-cashin a", {
      visible: true
    });
    await page.waitFor(1500);
    console.log("found cash in report button");
    await page.click("#sub-item-cashin a");
    console.log("clicked cash in report button");
    await page.waitForSelector("#available-stores div.store-item label", {
      visible: true
    });
    console.log("found available stores");
    await page.click("#available-stores div.store-item label");
    console.log("clicked available stores");
    await page.waitForSelector("#report", {
      visible: true
    });
    await page.waitForSelector(
      ".entity-arrow.group-store-date a i.fa.fa-chevron-down",
      {
        visible: true,
        timeout: 10000
      }
    );
    console.log("found down arrow");
    await page.click(".entity-arrow.group-store-date a i.fa.fa-chevron-down");
    console.log("clicked down arrow");
    await page.waitForSelector("#navbar-entity-wrapper", {
      visible: true
    });
    await page.waitForFunction(
      'document.querySelector("#navbar-entity-wrapper").classList.contains("show")'
    );
    await page.waitFor(1500);
    await page.waitForSelector("#btn-datepicker-decrement", {
      visible: true
    });
    console.log("found date picker");
    await page.click("#btn-datepicker-decrement");
    console.log("clicked date picker");
    await page.waitFor(1500);
    await page.waitForSelector("tr.bottom", {
      visible: true
    });
    await page.waitFor(1500);
    console.log("found last cash in");
    await page.click("tr.bottom td div a");
    console.log("clicked last cash in");
    await page.waitFor(1500);
    await page.waitForSelector(".jspPane p", {
      visible: true
    });
    await page.waitForFunction(
      'document.querySelector("#cashInReconciliation").style.opacity = 1'
    );
    await page.waitFor(1500);
    console.log("loaded cash in report");
    const cashInReport = await page.evaluate(() => {
      let paragraph = document.querySelector(
        "#report div.jspContainer div.jspPane p"
      ).innerHTML;
      paragraph = paragraph.replace(/(&nbsp;){2,}/gm, "&nbsp;");
      paragraph = paragraph.replace(/(<br>[\-\=\+\#]*&nbsp;)/gm, "<br>");
      paragraph = paragraph.split("<br>");
      let cashInReportArr = paragraph.map(el => {
        return el.replace(/(\r\n|\n|\r)/gm, "").split("&nbsp;");
      });

      return cashInReportArr;
    });
    console.log(cashInReport);
    await browser.close();
    res.send(cashInReport);
  })();
});

router.get("/get-wisr", function(req, res, next) {
  (async () => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto("https://liveiq.subway.com");
    await page.waitForSelector("#signInName");
    await page.type("#signInName", process.env.SUBWAY_USER);
    await page.type("#password", process.env.SUBWAY_PASS);
    await page.click("#next");
    console.log("made it to page");
    await page.waitForSelector("table.px-table.store-readings", {
      visibility: true
    });
    await page.waitForSelector(".store-num", {
      visible: true
    });
    console.log("store num");
    await page.waitFor(1000);
    await page.click(".store-num");
    console.log("clicked cash-in button");

    await page.waitForSelector("#entityselectorInput", {
      visible: true
    });
    await page.click("#entityselectorInput");

    await page.waitForSelector("div.entity div.item", {
      visible: true
    });
    console.log("found store selector");
    await page.click("div.entity div.item");
    console.log("found store selector");
    await page.waitFor(1500);
    var wisrUrl = await page.evaluate(() => {
      var wisrUrl =
        "https://liveiq.subway.com/Reporting/CombinedReports/WISR?id=QOEHUrk1o6w%3d&docName=WISR&reportType=mvc&weekEndDate=";

      var myDate = new Date();
      while (myDate.getDay() !== 2) {
        myDate.setDate(myDate.getDate() - 1);
      }

      var wisrDate = "";
      var year = myDate.getFullYear();
      if (myDate.getMonth() < 10) {
        var month = "0" + (Number(myDate.getMonth()) + 1);
      } else {
        var month = myDate.getMonth() + 1;
      }
      if (myDate.getDate() < 10) {
        var day = "0" + myDate.getDate();
      } else {
        var day = myDate.getDate();
      }

      wisrDate = year + "-" + month + "-" + day;

      wisrUrl = wisrUrl + wisrDate;
      return wisrUrl;
    });
    console.log(wisrUrl);
    await page.waitFor(1500);
    await page.goto(wisrUrl);
    await page.waitFor(1500);
    await page.waitFor("#ui-datepicker-div");
    const wisrData = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll("table.innerTable"));
      const finalArr = [];
      tables.forEach(table => {
        Array.from(table.rows).forEach((row, i) => {
          let tempArr = [];
          Array.from(row.cells).forEach(cell => {
            var cleanText = cell.innerText.replace("=", "");
            tempArr.push(cleanText);
          });
          finalArr.push(tempArr);
        });
      });
      return finalArr;
    });

    console.log(wisrData);

    await browser.close();
    res.send(wisrData);
  })();
});

module.exports = router;
