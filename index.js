const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const NSE = require('./models/NSE');
const connectDB = require('./config/db');




connectDB();

async function run() {
  try {
    const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.setViewport({width: 1366, height: 768});

  await page.goto("https://www1.nseindia.com/sme/marketinfo/corporates/actions/latestCorpActions.jsp");
 
  const numPages = 6;

  console.log('Numpages: ', numPages);

  for (let h = 1; h <= numPages; h++) {

    
    

    for (let i = 2; i <= 20; i++) {
    const [elCN] = await page.$x('//*[@id="wrapper_btm"]/div[1]/div[3]/div[2]/div/table[2]/tbody/tr['+i+']/td[2]');
    if(!elCN){
      continue;
    } 
    const txtCN = await elCN.getProperty('textContent');
    const companyName = await txtCN.jsonValue();

    
    const [elPur] = await page.$x('//*[@id="wrapper_btm"]/div[1]/div[3]/div[2]/div/table[2]/tbody/tr['+i+']/td[5]');
    if(!elPur){
      continue;
    } 
    const txtPur = await elPur.getProperty('textContent');
    const purpose = await txtPur.jsonValue();
    
    
    const [elDate1] = await page.$x('//*[@id="wrapper_btm"]/div[1]/div[3]/div[2]/div/table[2]/tbody/tr['+i+']/td[7]');
    if(!elDate1){
      continue;
    } 
    const d1 = await elDate1.getProperty('textContent');
    const date1 = await d1.jsonValue();


    const [elDate2] = await page.$x('//*[@id="wrapper_btm"]/div[1]/div[3]/div[2]/div/table[2]/tbody/tr['+i+']/td[6]');
    if(!elDate2){
      continue;
    } 
    const d2 = await elDate2.getProperty('textContent');
    const date2 = await d2.jsonValue();


    const [elDate3] = await page.$x('//*[@id="wrapper_btm"]/div[1]/div[3]/div[2]/div/table[2]/tbody/tr['+i+']/td[8]');
    if(!elDate3){
      continue;
    } 
    const d3 = await elDate3.getProperty('textContent');
    const date3 = await d3.jsonValue();


    const [elDate4] = await page.$x('//*[@id="wrapper_btm"]/div[1]/div[3]/div[2]/div/table[2]/tbody/tr['+i+']/td[9]');
    if(!elDate4){
      continue;
    } 
    const d4 = await elDate4.getProperty('textContent');
    const date4 = await d4.jsonValue();


    const [elDate5] = await page.$x('//*[@id="wrapper_btm"]/div[1]/div[3]/div[2]/div/table[2]/tbody/tr['+i+']/td[10]');
    if(!elDate5){
      continue;
    } 
    const d5 = await elDate5.getProperty('textContent');
    const date5 = await d5.jsonValue();


    const [elDate6] = await page.$x('//*[@id="wrapper_btm"]/div[1]/div[3]/div[2]/div/table[2]/tbody/tr['+i+']/td[11]');
    if(!elDate6){
      continue;
    } 
    const d6 = await elDate6.getProperty('textContent');
    const date6 = await d6.jsonValue();


    console.log(companyName+'->'+purpose+'->'+date1+'->'+date2+'->'+date3+'->'+date4+'->'+date5+'->'+date6);

    upsertUser({
      companyName: companyName,
      purpose: purpose,
      exDate: date1,
      recordDate: date2,
      BCstartDate: date3,
      BCendDate: date4,
      NDstartDate: date5,
      NDendDate: date6,
      dateCrawled: new Date()
    });
   }

   await page.waitFor(10 * 1000);
   
   page.click('a[href="https://www1.nseindia.com/sme/marketinfo/corporates/actions/latestCorpActions.jsp?currentPage=5"]')
  
  }

  browser.close();
} catch (err) {
    console.log(err);
}
}



function upsertUser(userObj) {
  
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  NSE.findOneAndUpdate(userObj, options, (err, result) => {
    if (err) {
      throw err;
    }
  });
}

run();
