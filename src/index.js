const date = require('./date');
const db = require('./db');
const pageHelper = require('./page-helper');
const validation = require('./validation');
const browserHelper = require('./browser-helper');
const interests = require('./interests');
const selectors = require('./selectors');

(async () => {
  validation.check();

  const { browser, page } = await browserHelper.setup();

  await pageHelper.login(page);

  const portfolioValue = await pageHelper.getMonetaryValue(page, selectors.portfolioValue);
  const totalProfit = await pageHelper.getMonetaryValue(page, selectors.totalInterest);
  const availableCash = await pageHelper.getMonetaryValue(page, selectors.availableFunds);

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
    initial_investment: portfolioValue - totalProfit, // this logic has to be changed once money is taken out
    profit: totalProfit,
    cash: availableCash,
  });

  await db.insertDailyInterest(connection, {
    date: date.yesterdayYmd,
    source: 'mintos',
    total: totalInterests,
    net: totalInterests,
  });
  process.exit(0);
})();
