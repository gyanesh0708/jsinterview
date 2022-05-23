const express = require('express');
const router = express.Router();

let auth = require("../util/auth").verifyToken

const loginController = require("../controllers/login.controller")

let requestValidate = require("../util/requestFilter").requestValidate

router.post('/signUp', requestValidate, loginController.signUp);
router.post('/signIn', requestValidate, loginController.signIn);
router.post('/process', requestValidate, auth, loginController.process);
router.get('/fetch', requestValidate, auth, loginController.fetch);


module.exports = router;

