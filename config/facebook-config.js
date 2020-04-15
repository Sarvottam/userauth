const{FACEBOOK_API_SECRET,FACEBOOK_API_KEY}=require("../config/constant")

module.exports={
    "clientID"      :     FACEBOOK_API_KEY,
    "clientSecret"   :     FACEBOOK_API_SECRET,
    "callbackURL"    : "http://localhost:4000/authorize/auth/facebook/callback",
    "profileFields": ['id', 'emails', 'name']
  }