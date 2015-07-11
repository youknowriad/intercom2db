module.exports = {
  debug: process.env.NODE_ENV !== 'production',

  database: {
    dialect: process.env.I2DB_DATABASE_DIALECT || 'mysql',
    host: process.env.I2DB_DATABASE_HOST || 'localhost',
    port: process.env.I2DB_DATABASE_PORT || 3306,
    user: process.env.I2DB_DATABASE_USER || 'root',
    password: process.env.I2DB_DATABASE_PASSWORD,
    database: process.env.I2DB_DATABASE_NAME || 'intercom',
    schema: process.env.I2DB_SCHEMA_NAME
  },
  intercom: {
    appId: process.env.I2DB_API_APP_ID,
    apiKey: process.env.I2DB_API_KEY
  }
};
