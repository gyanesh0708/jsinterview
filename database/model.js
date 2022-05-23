const Sequelize = require("sequelize");
const time = require('../util/getDateTime')

let dbConfig
if (process.env.NODE_ENV == "stag") {
    dbConfig = require("../config/staging.config.js");
} else if (process.env.NODE_ENV == "prod") {
    dbConfig = require("../config/prod.config.js");
} else if (process.env.NODE_ENV == "preprod") {
    dbConfig = require("../config/preprod.config.js");
}

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
    dialectOptions: {
       dateStrings: true,
	 typeCast: true
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./model/user.model.js")(sequelize, Sequelize);
db.userdata = require("./model/userData.model")(sequelize, Sequelize);


sequelize.authenticate().then((result) => {
    let logEntry = {
        operationName: "database.model",
        startTime: time.getTime(),
    }
    logEntry.message = "DB connection Successfull!!"
    logger.detach("info", logEntry);
}).catch(err => { console.log("db error", err) })

module.exports = db;
