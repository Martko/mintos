const moment = require('moment');

moment.locale('et');

const yesterday = moment().subtract(1, 'day');

module.exports = {
  twoDaysAgo: moment().subtract(2, 'day').format('L'),
  yesterday: yesterday.format('L'),
  yesterdayYmd: yesterday.format('YYYY-MM-DD'),
  yesterdayMonth: yesterday.month().toString(),
  yesterdayYear: yesterday.year().toString(),
  today: moment().format('L'),
};
