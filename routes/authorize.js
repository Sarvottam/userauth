var express = require('express');
var router = express.Router();
const passport =require ("passport");
const { login, register,socialLogin,reCaptcha,resetPassword,resetPasswordReq} = require("../controller/authorize")
const {grantAccess,allowIfLoggedin} = require("../RBAC/rbacCotroller")


router.post('/register', register)
router.post('/login', login)
router.get('/auth/facebook', passport.authorize('facebook', { scope : ['email'] }));
router.get('/auth/facebook/callback',socialLogin);

router.post('/reCaptchaSubmit',reCaptcha);

router.post('/resetPasswordRequest', resetPasswordReq);
router.post('/resetPassword',resetPassword);

// router.get('/logout',logut)


module.exports = router
