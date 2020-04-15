module.exports = {
BadRequest:{
    status:400,
    code:"BadRequest",
    message:"The request body contains bad syntax or is incomplete."
},
ValidationError:{
    status:400,
    code:"ValidationError",
    message:"Validation error(s) present. See embedded errors list for more details. (See below)"
},
InvalidCredentials:{
    status:401,
    code:"InvalidCredentials",
    message:"Missing or invalid Authorization header"
},
InvalidAccessToken:{
    status:401,
    code:"InvalidAccessToken",
    message:"Invalid access token"
},
ExpiredAccessToken:{
    status:401,
    code:"ExpiredAccessToken",
    message:"Generate a new access token using your client credentials"
},

InvalidAccountStatus:{
    status:401,
    code:"InvalidAccountStatus",
    message:"Invalid access token account status."
},	
InvalidApplicationStatus:{
    status:401,
    code:"InvalidApplicationStatus",
    message:"Invalid application status"
},
InvalidScopes:{
    status:401,
    code:"InvalidScopes",
    message:"Missing or invalid scopes for requested endpoint."
},
ServerError:{
    status:500,
    code:"ServerError",
    message:"The request timed out"
}
}