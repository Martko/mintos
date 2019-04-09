/**
 * Clear input from default contents
 */
const clearInput = async (page, selector) => {
  await page.evaluate(
    (sel) => { document.querySelector(sel).value = ''; },
    selector,
  );
};

const fillDateFrom = async (page, dateValue) => {
  const periodFromElement = '#period-from';

  clearInput(page, periodFromElement);
  await page.type(periodFromElement, dateValue);
};

const fillDateTo = async (page, dateValue) => {
  const periodToElement = '#period-to';

  clearInput(page, periodToElement);
  await page.type(periodToElement, dateValue);
};

/**
 * Log in via web interface
 * @param {Page} page
 */
const login = async (page) => {
  await page.goto('https://www.mintos.com/en/login');
  await page.type('input[name="_username"]', process.env.MINTOS_USERNAME);
  await page.type('input[name="_password"]', process.env.MINTOS_PASSWORD);
  await page.click('button.account-login-btn');
  await page.waitForSelector('.overview-box');
};

module.exports = {
  fillDateFrom,
  fillDateTo,
  login,
};
