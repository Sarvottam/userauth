var validator = require("email-validator");
module.exports = {

    userObj: function (dataObj) {
        let { name, email, password, role, dob,mobile } = dataObj
        // console.log("Here this ",this)
        checkForValidField(dataObj)
       
        return {
            name: name,
            email: email, // String is shorthand for {type: String}
            password: password,
            role: role,
            dob: dob,
            mobile:mobile
        }
    },

    adminKycObj: function (dataObj) {
        let { _id, kycVerified } = dataObj
        checkForKycApproval(dataObj)
        return {
            kycVerified: kycVerified
        }
    },



    userUpdateObj: function (dataObj) {

        let { first_name, last_name, investorType, profileImg, govtPhotoId, address1, address2, city, state, zipCode } = dataObj

        checkForUpdateFields(dataObj)
        
    


        const updateFields = {
            name: `${first_name}+' '+${last_name}`,
            investorType:investorType,
            address: {
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                zipCode: zipCode

            },
        }
        if (profileImg) {
            const { filePath, mimeType, name } = profileImg
            updateFields.profileImg = {
                filePath: filePath,
                mimeType: mimeType,
                name: name
            }
        }

        if (govtPhotoId) {
            const { filePath, mimeType, name } = govtPhotoId
            updateFields.govtPhotoId = {
                filePath: filePath,
                mimeType: mimeType,
                name: name
            }
            updateFields.kycVerified = 'Pending';
        }

        return updateFields;

    },

    resetPassObj: function (dataObj) {
        let { token, password, confirmPassword } = dataObj

        checkForResetPassword(dataObj)
        return {
            password: password,
            resetPasswordJwt: null
        }
    }
}


let checkForKycApproval = (dataObj) => {
    const { _id, kycVerified } = dataObj

    if (!_id) {
        throw ("Id is missing")
    }
    else if (!kycVerified) {
        throw ("kycStatus is incorrect or missing")
    }
    return;
}

let checkForUpdateFields = (dataObj) => {
    const { first_name, last_name, address1,address2,city,state,zipCode,investorType } = dataObj
  
    if (!first_name) {
        throw ("First Name missing")
    }
    else if (!last_name) {
        throw ("Last Name missing")
    }
    else if (!address1) {
        throw ("address1 is missing")
    }
    else if (!address2) {
        throw ("address2 missing")
    }
    else if (!city) {
        throw ("city missing");
    }
    else if (!state) {
        throw ("state missing");
    }
    else if (!zipCode) {
        throw ("zipCode missing")
    }
    else if (!investorType){
        throw ("investorType missing")
    }
return;
}

let checkForResetPassword = (dataObj) => {
    const { token, password, confirmPassword } = dataObj
    if (!token) {
        throw (" token missing")
    }
    else if (!password) {
        throw ("password missing")
    }
    else if (!confirmPassword) {
        throw ("confirmPassword missing");
    }
    else if (password !== confirmPassword) {
        throw ("password and confirmPassword does not match ")
    }

    return;
}



let checkForValidField = (dataObj) => {
    const { name, email, password, role, dob,mobile } = dataObj
    console.log("HHHHHHHPPPPPPP ", name, email, password, role, dob)
    if (!name) {
        throw (" name missing")
    }
    else if (!email) {
        throw ("email missing")
    }
    else if (!password) {
        throw ("password missing");
    }
    else if (!role) {
        throw ("role missing");
    }
   
    else if (!validator.validate(email)) {
        throw ("Email not properly formated")
    }
    return;
}