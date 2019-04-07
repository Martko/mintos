const puppeteer = require('puppeteer');
const date = require('./date');
const db = require('./db');

const validateSetup = async () => {
  if (!process.env.MINTOS_USERNAME || !process.env.MINTOS_PASSWORD) {
    console.error('Couldn\'t find username and/or password setup');
    process.exit(1);
  }
};

const login = async (page) => {
  await page.goto('https://www.mintos.com/en/login');
  await page.type('input[name="_username"]', process.env.MINTOS_USERNAME);
  await page.type('input[name="_password"]', process.env.MINTOS_PASSWORD);
  await page.click('button.account-login-btn');
  await page.waitForSelector('.overview-box');
};

const setupBrowser = async () => {
  const browser = await puppeteer.launch({
    // eslint-disable-next-line eqeqeq
    headless: process.env.MINTOS_HEADLESS == 'true',
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 720 });

  return {
    browser,
    page,
  };
};

(async () => {
  validateSetup();

  const { browser, page } = await setupBrowser();

  await login(page);

  await page.goto('https://www.mintos.com/en/account-statement/');

  let selector = '#period-from';
  await page.evaluate((sel) => { document.querySelector(sel).value = ''; }, selector);
  await page.type('#period-from', date.twoDaysAgo);

  selector = '#period-to';
  await page.evaluate((sel) => { document.querySelector(sel).value = ''; }, selector);
  await page.type('#period-to', date.yesterday);
  await page.click('#filter-button');

  const INTEREST_RECIEVED_SELECTOR = '#overview-results > table > tbody > tr:nth-child(5) > td.in > span';
  const INTEREST_RECEIVED_ON_REBUY = '#overview-results > table > tbody > tr:nth-child(7) > td.in > span';

  await page.waitForSelector(INTEREST_RECEIVED_ON_REBUY);

  const interestAmount = await page.evaluate((sel) => {
    const interestSelector = document.querySelector(sel);
    return interestSelector ? parseFloat(interestSelector.innerHTML) : null;
  }, INTEREST_RECIEVED_SELECTOR);

  const interestAmountOnRebuy = await page.evaluate((sel) => {
    const interestSelector = document.querySelector(sel);
    return interestSelector ? parseFloat(interestSelector.innerHTML) : null;
  }, INTEREST_RECEIVED_ON_REBUY);

  const totalInterests = interestAmount + interestAmountOnRebuy;

  await browser.close();

  await db.insert({
    source: 'mintos',
    month: date.yesterdayMonth,
    year: date.yesterdayYear,
    interest_amount: totalInterests,
    net_profit: totalInterests,
  });

  process.exit(0);
})();
