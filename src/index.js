const date = require('./date');
const db = require('./db');
const pageHelper = require('./page-helper');
const validation = require('./validation');
const browserHelper = require('./browser-helper');
const interests = require('./interests');

(async () => {
  validation.check();

  const { browser, page } = await browserHelper.setup();

  await pageHelper.login(page);
  await page.goto('https://www.mintos.com/en/account-statement/');

  await pageHelper.fillDateFrom(page, date.yesterday);
  await pageHelper.fillDateTo(page, date.yesterday);
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
