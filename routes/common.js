var express = require('express');
var router = express.Router();
const {verifyJWTImg} =require("../utils/authMiddleware");
const {protected} = require("../controller/common");


router.get('/public/*',verifyJWTImg, protected);



module.exports = router
