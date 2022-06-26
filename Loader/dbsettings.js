const config = {
  user: 'user_bps',
  password: '',
  server:  'localhost',
  database: 'BanknoteList',
  options: {
    encrypt: false,
    useUTC: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000/* ,
    trustServerCertificate: true */
  },
};

module.exports = config;



