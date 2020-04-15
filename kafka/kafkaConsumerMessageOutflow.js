//This file is to handle the message from the  kafka consumer. this file will be responsible to send  messages to this native service

// const {verifyJWT} = require("../utils/authMiddleware")
const {Dbhelper} =require("../helper/dbHelper")
module.exports = {
    processEventData: (data) => {
        switch(data.topic) {
            case "RESPONSE_FOR_JWT_VERIFICATION_FOR_BANKING_INSERT" :
                console.log("here finally processEventData consumer ",data)
            break;
            // case "VERIFY_JWT" :
            //     console.log("here")
            //     verifyJWT(req,res,next);
            // break;
            case "VERIFY_JWT_RESPONSE_FOR_USERS" : // here we have to pass the data to appconfig
                console.log("here VERIFY_JWT_RESPONSE_FOR_USERS processEventData")
                // verifyJWT(req,res,next);
            break;
        }
    }
}