/**
 * Clear input from default contents
 */
module.exports.clearInput = async (page, selector) => {
  await page.evaluate(
    (sel) => { document.querySelector(sel).value = ''; },
    selector,
  );
};

/**
 * Log in via web interface
 * @param {Page} page
 */
module.exports.login = async (page) => {
  await page.goto('https://www.mintos.com/en/login');
  await page.type('input[name="_username"]', process.env.MINTOS_USERNAME);
  await page.type('input[name="_password"]', process.env.MINTOS_PASSWORD);
  await page.click('button.account-login-btn');
  await page.waitForSelector('.overview-box');
};
