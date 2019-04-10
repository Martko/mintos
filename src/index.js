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

  const portfolioValue = (await pageHelper.getElementContent(
    page,
    'li.overview-box div.value',
  )).replace(/€|\s/g, '');

  await page.goto('https://www.mintos.com/en/account-statement/');
  await pageHelper.fillDateFrom(page, date.yesterday);
  await pageHelper.fillDateTo(page, date.yesterday);
  await page.click('#filter-button');

  const response = await page.waitForResponse('https://www.mintos.com/en/account-statement/list');
  const totalInterests = interests.getTotalSum(await response.json());

  await browser.close();

  const connection = await db.getConnection();
  await db.insertPortfolioValue(connection, {
    date: date.yesterdayYmd,
    source: 'mintos',
    value: portfolioValue,
  });

  await db.insertDailyInterest(connection, {
    date: date.yesterdayYmd,
    source: 'mintos',
    total: totalInterests,
    net: totalInterests,
  });
  process.exit(0);
})();
