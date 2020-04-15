var express = require('express');
var router = express.Router();
const jwt = require("../utils/authMiddleware");
const {pendingKyc, approveKyc } = require("../controller/admin")
const {grantAccess,allowIfLoggedin} = require("../RBAC/rbacCotroller")


router.get('/pendingKyc', allowIfLoggedin, grantAccess('readAny', 'profile'), pendingKyc);
router.post('/approveKyc',  allowIfLoggedin, grantAccess('updateAny', 'profile'), approveKyc);


module.exports = router
