const { Dbhelper:dbInstance } = require("../helper/dbHelper");
const { USER_COLLECTION, ROLE_INVESTOR, RECAPTCHA_SECRET, RECAPTCHA_URL } = require("../config/constant");
const bcrypt = require('bcrypt');
const { generateJWT, generateResetJWT, verifyResetJWT } = require("../utils/authMiddleware");
const { userObj, resetPassObj } = require("../helper/dataObj");

const generator = require('generate-password');
const axios = require('axios');
const emailHelper = require("../helper/mailHelper");

// const fetch = require('isomorphic-fetch');

/**
 * signup logic for seller or user
*/

const reCaptcha = async (req, res) => {
    try {
        console.log('heeeere reCAptcha')
        const secret_key = RECAPTCHA_SECRET
        let { token } = req.body;
        const url = `${RECAPTCHA_URL}secret=${secret_key}&response=${token}`
        axios({
            method: 'post',
            url,
        }).then(function (response) {
            if (response.data.success) {

                return _handleResponse(req, res, null, response.data)
            }
            else {
                return _handleResponse(req, res, response.data)
            }
        }).catch(function (error) {
            return _handleResponse(req, res, error)
        });
    }
    catch (e) {
        console.error("EEEEE ", e)
        return _handleResponse(req, res, e)
    }
};

const register = async (req, res) => {
    try {

        let { name, email, password, role = ROLE_INVESTOR ,dob,mobile} = req.body
        console.log("Here i am ", name, email, password)
        if (!mobile) {
            throw ("mobile missing");
        }
        let userDoc = userObj({ name, email, password, role, dob,mobile })
        let emailExist = await dbInstance.getDocumentByEmail(email);
        if (emailExist) {
            throw ("An Email already exist .Please login ");
        }
        
        userDoc.password = await generatePasswordHash(password)
        let inserted = await dbInstance.insertDocument(USER_COLLECTION, userDoc)
        console.info("inserted ", inserted._id)//.ops[0]._id)
        return _handleResponse(req, res, null, inserted._id)
    } catch (e) {
        console.error("EEEEE ", e)
        return _handleResponse(req, res, e)
    }
}


const socialLogin = async (req, res) => {
    await passport.authenticate('facebook', async function(err, user, info) {
    if (err){
        return _handleResponse(req, res, err);
    }    
    try {
        let pass = generator.generate({
            length: 10,
            numbers: true

        });
        console.log(user)
        let { first_name, last_name, email, password = pass, role = ROLE_INVESTOR} = user._json;
        let name = first_name + " " + last_name;
        let userDoc = userObj({ name, email, password, role });
        let emailExist = await dbInstance.getDocumentByEmail(email);
        if (emailExist) {
            let { _id, role } = await dbInstance.getDocumentByEmail(email);
            let jwtToken = await generateJWT({ email, _id, role });
            return _handleResponse(req, res, null, { _id, jwtToken })
        }
        else {
            userDoc.password = await generatePasswordHash(password)
            let inserted = await dbInstance.insertDocument(USER_COLLECTION, userDoc)
            let jwtToken = await generateJWT({ email, _id: inserted._id, role });
            return _handleResponse(req, res, null, { _id: inserted._id, jwtToken })
        }
    } catch (err) {
        console.error("EEEEE ", err)
        return _handleResponse(req, res, err)
    }
    })(req, res);
}

const login = async (req, res) => {
    let { email, password: userEnteredPassword } = req.body;
    try {
        if (!email){
            throw ("email missing");
        } 
        if (!userEnteredPassword){
            throw ("password missing");
        } 
        let emailExist = await dbInstance.getDocumentByEmail(email);
        if (!emailExist) {
            throw ("Email not registered. Please sign up ");
        }
        let { password: existingPassword, _id, role, } = await dbInstance.getDocumentByEmail(email);
        console.log("existingPassword ",existingPassword)
        let passwordMatch = await comparePasswordHash(userEnteredPassword, existingPassword)
        if (!passwordMatch) {
            throw new Error("Wrong Password");
        }
        // generateJWT
        let jwtToken = await generateJWT({ email, _id, role });
        return _handleResponse(req, res, null, jwtToken)
    } catch (e) {
        console.log("Error login :: ", e)
        return _handleResponse(req, res, e)
    }
}


const resetPasswordReq = async (req, res) => {
    const { email, url } = req.body
    try {
        if (!email) {
            throw ("Email missing");
        }
        if (!url) {
            throw ("Url missing");
        }
        let emailExist = await dbInstance.getDocumentByEmail(email);
        if (!emailExist) {
            throw ("Email not registered.Please enter registered email");
        }
        let resetPasswordJwt = await generateResetJWT({ email, _id: emailExist._id, role: emailExist.role });
        let updateUser = await dbInstance.updateDocument(USER_COLLECTION, emailExist._id, { resetPasswordJwt: resetPasswordJwt });
        await emailHelper.sendResetPass(email,url,resetPasswordJwt);     
        return _handleResponse(req, res, null,'Mail is sent sucessfully')         

    }
    catch (e) {
        console.log("Error login :: ", e)
        return _handleResponse(req, res, e)
    }
}

const resetPassword = async (req, res) => {

    try {
        const { token, password, confirmPassword } = req.body;
        let resetPass = resetPassObj({ token, password, confirmPassword });
        verifyResetJWT(token);
        let tokenExist = await dbInstance.ifTokenExist(token);
        if (!tokenExist) {
            throw ('Token is already used or Expired');
        }
        resetPass.password = await generatePasswordHash(password); 
        const updatedPass =await dbInstance.updateDocument(USER_COLLECTION,tokenExist._id,resetPass);         
        return _handleResponse(req, res, null,'Password updated Sucessfully')         
    }
    catch (e) {
        console.error("EEEEE ", e)
        return _handleResponse(req, res, e) 
    }
}



const generatePasswordHash = async (plainPassword) => {
    let salt = bcrypt.genSaltSync(11);
    return bcrypt.hashSync(plainPassword, salt);
}
const comparePasswordHash = async (plainPassword, hash) => {
    return bcrypt.compareSync(plainPassword, hash);
}


module.exports = {
    register: register,
    login: login,
    socialLogin: socialLogin,
    reCaptcha: reCaptcha,
    resetPassword: resetPassword,
    resetPasswordReq: resetPasswordReq

}