const { v4: uuidv4 } = require('uuid');

const requestValidate = module.exports.requestValidate = (req, res, next) => {
    try {
        if (!req.headers["correlationId"] || req.headers["correlationId"] == null || req.headers["correlationId"] == "") {
            req.headers["correlationId"] = uuidv4()
        }
        next()
    } catch (error) {
        console.log("requestValidate Error", error)
    }
}