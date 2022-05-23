const jwt = require("jsonwebtoken");

const verifyToken = module.exports.verifyToken = (req, res, next) => {
    let token = req.headers["authorization"].split(" ")[1];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, dbConfig.JWTSECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};

