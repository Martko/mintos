const puppeteer = require('puppeteer');
const date = require('./date');
const db = require('./db');
const pageHelper = require('./page-helper');
const validation = require('./validation');

/**
 * Calculates total interest sum
 * @param {} jsonData
 */
const getTotalInterestSum = (jsonData) => {
  const statementEntries = jsonData.data.summary.statementEntryGroups;
  const balanceStatementEntryTypes = [
    '17', // Interest received
    '46', // Interest income on rebuy
    '117', // Refer a friend bonus
  ];

  let interests = 0;

  for (let i = 0; i < balanceStatementEntryTypes.length; i += 1) {
    const entryType = balanceStatementEntryTypes[i];

    if (statementEntries.hasOwnProperty(entryType)) {
      interests += parseFloat(statementEntries[entryType]);
    }
  }

  return interests;
};

/**
 * Sets up browser and does the initial configuration
 */
const setupBrowser = async () => {
  const browser = await puppeteer.launch({
    // eslint-disable-next-line eqeqeq
    headless: process.env.HEADLESS_BROWSER == 'true',
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 720 });

  return {
    browser,
    page,
  };
};

(async () => {
  validation.check();

  const periodFromElement = '#period-from';
  const periodToElement = '#period-to';
  const { browser, page } = await setupBrowser();

  await pageHelper.login(page);
  await page.goto('https://www.mintos.com/en/account-statement/');

  pageHelper.clearInput(page, periodFromElement);
  await page.type(periodFromElement, date.yesterday);

  pageHelper.clearInput(page, periodToElement);
  await page.type(periodToElement, date.yesterday);
  await page.click('#filter-button');

  const response = await page.waitForResponse('https://www.mintos.com/en/account-statement/list');
  const totalInterests = getTotalInterestSum(await response.json());

  await browser.close();
  await db.insert({
    source: 'mintos',
    total: totalInterests,
    net: totalInterests,
  });
  process.exit(0);
})();
