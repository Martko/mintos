const moment = require('moment');

moment.locale('et');

const yesterday = moment().subtract(1, 'day');

module.exports = {
  twoDaysAgo: moment().subtract(2, 'day').format('L'),
  yesterday: yesterday.format('L'),
  yesterdayMonth: yesterday.month().toString(),
  yesterdayYear: yesterday.year().toString(),
  today: moment().format('L'),
};
