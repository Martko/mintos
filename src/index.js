const date = require('./date');
const db = require('./db');
const pageHelper = require('./page-helper');
const validation = require('./validation');
const browserHelper = require('./browser-helper');
const interests = require('./interests');

(async () => {
  validation.check();

  const periodFromElement = '#period-from';
  const periodToElement = '#period-to';
  const { browser, page } = await browserHelper.setup();

  await pageHelper.login(page);
  await page.goto('https://www.mintos.com/en/account-statement/');

  pageHelper.clearInput(page, periodFromElement);
  await page.type(periodFromElement, date.yesterday);

  pageHelper.clearInput(page, periodToElement);
  await page.type(periodToElement, date.yesterday);
  await page.click('#filter-button');

  const response = await page.waitForResponse('https://www.mintos.com/en/account-statement/list');
  const totalInterests = interests.getTotalSum(await response.json());

  await browser.close();
  await db.insert({
    source: 'mintos',
    total: totalInterests,
    net: totalInterests,
  });
  process.exit(0);
})();
