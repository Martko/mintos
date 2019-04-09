module.exports.check = async () => {
  if (!process.env.MINTOS_USERNAME || !process.env.MINTOS_PASSWORD) {
    console.error('Couldn\'t find username and/or password setup');
    process.exit(1);
  }
};
