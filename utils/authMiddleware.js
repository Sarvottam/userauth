const JWT = require("jsonwebtoken");
const { JWT_PRIVATE_KEY, IMAGE_RESTRICTION, ADMIN_ROUTES, ROLE_ADMIN, ROLE_INVESTOR, ROLE_PROPERTY_OWNER, INVESTOR_ROUTES, ROLE_PROPERTY_OWNER_ROUTES } = require("../config/constant")
const { consumerInstace } = require("../kafka/kafkaConsumerService");
const { sendData } = require("../kafka/kafkaProducerMessageInflow");

async function generateJWT(payloadDataObj) {
    try {
        console.log(JSON.stringify(payloadDataObj));
        return JWT.sign({ exp: Math.floor(Date.now() / 1000) + 24 * (60 * 60), data: payloadDataObj }, JWT_PRIVATE_KEY);
    } catch (e) {
        console.log("ERROR :generateJWT", e)
        throw new Error(e)
    }
}

async function generateResetJWT(payloadDataObj) {
    try {
        return JWT.sign({ payloadDataObj }, JWT_PRIVATE_KEY, {
            expiresIn: 3600 // 1 hour
        })
    } catch (e) {
        console.log("ERROR :generateJWT", e)
        throw new Error(e)
    }
}

async function verifyResetJWT(token) {
    try {
        const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
        return decoded;
    } catch (e) {
        console.log("ERROR :generateJWT", e)
        throw new Error('Token is expired ,Please raise request again')
    }
}


// async function verifyJWTMiddleware(accessToken) {
//     return new Promise((resolve, reject) => {
//         JWT.verify(accessToken, JWT_PRIVATE_KEY, async (err, result) => {
//             if (!err) {
//                 console.log("data here inside verifyJWTMiddleware", { exp: result.exp, email: result.data.email, userId: result.data._id, role: result.data.role })
//                 return resolve({ exp: result.exp, email: result.data.email, userId: result.data._id, role: result.data.role });

//             } else {
//                 console.log("ERROR Here ", err.message)
//                 reject(err)
//             }
//         })
//     })
// }

/**
 *Here first we send access token to authentication microservice,
 then we wait for the authentication service to send Response(can be either ERROR or success)
 *
 * @param {string} accessToken JWT Token
 * @returns {object} for userData
 */
async function middlewareHelper(accessToken) {
    return new Promise(async (resolve, reject) => {
        try {
            let payloads = [{
                topic: "VERIFY_JWT",
                messages: JSON.stringify({
                    type: "VERIFY_JWT",
                    data: accessToken
                })
            }]
            await sendData(payloads)
            //Listen
            let consumerEventListner = await consumerInstace.consumerReady();
            consumerEventListner.on("message", async (data) => {
                console.log("got data for Middleware ", data)
                let message = JSON.parse(data.value);
                if (data.topic == "VERIFY_JWT_RESPONSE_FOR_USERS" && message.token == accessToken) {
                    console.log("Here success response authMiddleware")
                    resolve(message.data);
                }
                if (data.topic == "VERIFY_JWT_RESPONSE_FOR_USERS_ERROR" && message.token == accessToken) {
                    console.log("ERROR ", data)
                    reject(message.data)
                }
            })
        } catch (e) {
            console.log("middlewareHelper error ", e)
            reject(e)
        }
    })
}

// async function verifyJWT(req, res, next) {
//     try {
//         if (req && req.headers && req.headers.authorization) {
//             // console.log("Here is ", req.route.path.trim())
//             let path = req.route.path.trim();
//             path = path.slice(1, path.length);
//             path = path.toLowerCase();
//             console.log(req.headers.authorization)
//             JWT.verify(req.headers.authorization, JWT_PRIVATE_KEY, async (err, decoded) => {
//                 console.log("Decoded ", decoded)
//                 try {
//                     if (err) {
//                         throw (err)
//                     }
//                     let currentTimestamp = Math.floor(Date.now() / 1000) + (60 * 60)

//                     if (currentTimestamp > decoded.exp) {
//                         return _handleResponse(req, res, "JWT expired, Please login again")
//                     }
//                     let authorised = await isAuthorised(decoded, path)

//                     if (!authorised) {
//                         throw Error("Permission Denied, User not authorised to perform this operation")
//                     }
//                     req.data = decoded.data
//                     next();
//                 } catch (e) {
//                     return _handleResponse(req, res, e)
//                 }
//             });
//         } else {
//             return _handleResponse(req, res, "JWT not availaible")
//         }
//     } catch (e) {
//         console.log("ERROR :verifyJWT :::::", e)
//         return _handleResponse(req, res, e)
//     }
// }

async function verifyJWTImg(req, res, next) {

    try {
        if (req && req.headers && req.headers.authorization) {
            console.log(req.path)
            const reqPath = req.path.toLowerCase();
            const arr = reqPath.split("/");
            JWT.verify(req.headers.authorization, JWT_PRIVATE_KEY, async (err, decoded) => {
                console.log("Decoded ", decoded)
                try {
                    if (err) {
                        throw (err)
                    }
                    let currentTimestamp = Math.floor(Date.now() / 1000) + (60 * 60)

                    if (currentTimestamp > decoded.exp) {
                        return _handleResponse(req, res, "JWT expired, Please login again")
                    }
                    let authorised = await isImgAuthorised(decoded, arr[3], arr[4])

                    if (!authorised) {
                        throw Error("Permission Denied, User not authorised to perform this operation")
                    }
                    //req.data = decoded.data
                    next();
                } catch (e) {
                    return _handleResponse(req, res, e)
                }
            });
        } else {
            return _handleResponse(req, res, "JWT not availaible")
        }
    } catch (e) {
        console.log("ERROR :verifyJWT :::::", e)
        return _handleResponse(req, res, e)
    }
}
async function decodeJWT() {
    try {
        return JWT.decode({ exp: Math.floor(Date.now() / 1000) + 24 * (60 * 60), data: payloadDataObj }, JWT_PRIVATE_KEY);
    } catch (e) {
        console.log("ERROR :decodeJWT ::::: ", e)
        throw new Error(e)
    }
}

async function isImgAuthorised(decodedJWT, path, imageid) {
    console.log(path)
    const { role, _id } = decodedJWT.data
    if (IMAGE_RESTRICTION.includes(path)) {
        if (role === ROLE_ADMIN) {
            return true
        }
        else if (_id === imageid) {
            return true
        }
        else {
            return false
        }
    } else {
        return true
    }
}

module.exports = {
    generateJWT,
    generateResetJWT,
    decodeJWT,
    verifyJWTImg,
    verifyResetJWT,
    middlewareHelper
}