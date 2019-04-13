const moment = require('moment');
const db = require('./db');
const pageHelper = require('./page-helper');
const validation = require('./validation');
const browserHelper = require('./browser-helper');
const interests = require('./interests');

moment.locale('et');

const handleResponseReceived = async (connection, nextDate, totalInterests) => {
  await db.insertDailyInterest(connection, {
    date: nextDate.format('YYYY-MM-DD'),
    source: 'mintos',
    total: totalInterests,
    net: totalInterests,
  });
};

const handleAccountStatementResponse = async (connection, page, nextDate) => {
  await page.waitForResponse('https://www.mintos.com/en/account-statement/list', { timeout: 3000 }).then(async (response) => {
    const totalInterests = interests.getTotalSum(await response.json());

    await handleResponseReceived(connection, nextDate, totalInterests);
  }).catch(async (err) => {
    console.log(`getAccountStatementResponse failed: ${err}`);

    await page.click('#filter-button');
    await handleAccountStatementResponse(connection, page, nextDate);
  });
};

(async () => {
  validation.check();

  // in YYYY-MM-DD format
  const startDate = moment(process.argv[2]);
  const endDate = moment(process.argv[3]);

  const { browser, page } = await browserHelper.setup();

  await pageHelper.login(page);

  await page.goto('https://www.mintos.com/en/account-statement/');

  const connection = await db.getConnection();

  let nextDate = startDate;
  /* eslint-disable no-await-in-loop */
  while (nextDate <= endDate) {
    console.log(nextDate);

    await pageHelper.fillDateFrom(page, nextDate.format('L'));
    await pageHelper.fillDateTo(page, nextDate.format('L'));
    await page.click('h1');
    await page.click('#filter-button');

    await handleAccountStatementResponse(connection, page, nextDate);

    nextDate = moment(nextDate).add(1, 'day');
  }

  await browser.close();
  process.exit(0);
})();
