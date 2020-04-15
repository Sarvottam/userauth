var express = require('express');
var router = express.Router();
const {allowIfLoggedin,grantAccess} = require("../RBAC/rbacCotroller")
const {update,userDetails} = require("../controller/user")


router.put('/update',allowIfLoggedin,grantAccess('readOwn', 'profile'),update);
router.get('/update',allowIfLoggedin,grantAccess('readOwn', 'profile'),userDetails)

module.exports = router
