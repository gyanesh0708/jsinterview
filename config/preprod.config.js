module.exports = {
  JWTSECRET: "gyanesh-secret-key",
  HOST: "localhost",
  USER: "root",
  PASSWORD: "Pass@1234",
  DB: "jsinterview",
  dialect: "mysql",
  pool: {
    max: 10,
    min: 2,
    acquire: 60000,
    idle: 10000
  }
};
