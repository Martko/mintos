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

  await clearInput(page, periodFromElement);
  await page.type(periodFromElement, dateValue);
};

const fillDateTo = async (page, dateValue) => {
  const periodToElement = '#period-to';

  await clearInput(page, periodToElement);
  await page.type(periodToElement, dateValue);
};

/**
 *
 * @param {Page} page
 * @param {string} selector
 */
const getElementContent = async (page, selector) => page.evaluate(
  el => el.textContent,
  await page.$(selector),
);

/**
 * Get monetary value from a page
 * @param {Page} page
 * @param {string} selector
 */
const getMonetaryValue = async (page, selector) => (await getElementContent(page, selector)).replace(/€|\s/g, '');

/**
 * Log in via web interface
 * @param {Page} page
 */
const login = async (page) => {
  await page.goto('https://www.mintos.com/en/login');
  await page.waitForSelector('input[name="_username"]');
  await page.type('input[name="_username"]', process.env.MINTOS_USERNAME);
  await page.type('input[name="_password"]', process.env.MINTOS_PASSWORD);
  await page.click('button.account-login-btn');
  await page.waitForSelector('.overview-box');
};

module.exports = {
  fillDateFrom,
  fillDateTo,
  login,
  getElementContent,
  getMonetaryValue,
};
