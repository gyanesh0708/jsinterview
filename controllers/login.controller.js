const db = require('../database/model');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const time = require('../util/getDateTime')

const User = db.user;
const UserData = db.userdata;

const signUp = module.exports.signUp = async (req, res) => {
    let logEntry = {
        correlationId: req.headers.correlationId,
        operationName: "login.signUp",
        startTime: time.getTime(),
        // request: req.body
    }
    logEntry.message = "request received";
    logger.detach("info", logEntry);
    try {
        User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8)
        }).then(user => {
            let token = jwt.sign({ id: user.id }, dbConfig.JWTSECRET, {
                expiresIn: 86400 // 24 hours
            });

            logEntry.message = "signUp succesfull";
            logger.detach("info", logEntry);
            logger.detach("debug", logEntry);

            return res.status(200).send({
                username: user.username,
                accessToken: token
            });

        }).catch(err => {
            logEntry.message = "Error Caught in User.create catch block";
            logEntry.stackTrace = err
            logger.detach("info", logEntry);
            return res.status(500).send({ message: err.message });
        });

    } catch (error) {
        logEntry.message = "Error Caught in try/catch block";
        logEntry.stackTrace = error
        logger.detach("info", logEntry);
        return res.status(500).json(error);
    }
}

const signIn = module.exports.signIn = async (req, res) => {
    let logEntry = {
        correlationId: req.headers.correlationId,
        operationName: "login.signIn",
        startTime: time.getTime(),
        // request: req.body
    }
    logEntry.message = "request received";
    logger.detach("info", logEntry);
    try {

        User.findOne({
            where: {
                username: req.body.username
            }
        })
            .then(user => {
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }

                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
                }

                var token = jwt.sign({ id: user.id }, dbConfig.JWTSECRET, {
                    expiresIn: 86400 // 24 hours
                });
                logEntry.message = "signIn succesfull";
                logger.detach("info", logEntry);
                logger.detach("debug", logEntry);

                return res.status(200).send({
                    username: user.username,
                    accessToken: token
                });

            }).catch(err => {
                logEntry.message = "Error Caught in User.create catch block";
                logEntry.stackTrace = error
                logger.detach("info", logEntry);

                return res.status(500).send({ message: err.message });
            });

    } catch (error) {
        logEntry.message = "Error Caught in try/catch block";
        logEntry.stackTrace = error
        logger.detach("info", logEntry);
        return res.status(500).send({ message: "Something Went Wront, Please try again" });
    }
}

const process = module.exports.process = async (req, res) => {

    let logEntry = {
        correlationId: req.headers.correlationId,
        operationName: "login.process",
        startTime: time.getTime(),
        // request: req.body
    }
    logEntry.message = "request received";
    logger.detach("info", logEntry);
    try {
        let insertObj = req.body.filter(obj => obj.randAlphabet == "a" || obj.randAlphabet == "b");
        UserData.bulkCreate(insertObj).then(response => {
            logEntry.message = "data inserted successfully";
            logger.detach("info", logEntry);
            logger.detach("debug", logEntry);

            return res.status(200).send({
                message: "data inserted successfully"
            });

        }).catch(err => {
            logEntry.message = "Error Caught in User.create catch block";
            logEntry.stackTrace = err
            logger.detach("info", logEntry);
            return res.status(500).send({ message: err.message });
        });

    } catch (error) {
        logEntry.message = "Error Caught in try/catch block";
        logEntry.stackTrace = error
        logger.detach("info", logEntry);
        return res.status(500).send({ message: "Something Went Wront, Please try again" });
    }
}

const fetch = module.exports.fetch = async (req, res) => {

    let logEntry = {
        correlationId: req.headers.correlationId,
        operationName: "login.fetch",
        startTime: time.getTime(),
    }
    logEntry.message = "request received";
    logger.detach("info", logEntry);
    try {
        UserData.findAll().then(response => {
            logEntry.message = "successfully executed findall";
            logger.detach("info", logEntry);
            logger.detach("debug", logEntry);
            return res.status(200).send(response);
        }).catch(err => {
            logEntry.message = "Error Caught in User.create catch block";
            logEntry.stackTrace = err
            logger.detach("info", logEntry);
            return res.status(500).send({ message: err.message });
        });

    } catch (error) {
        logEntry.message = "Error Caught in try/catch block";
        logEntry.stackTrace = error
        logger.detach("info", logEntry);
        return res.status(500).send({ message: "Something Went Wront, Please try again" });
    }
}