const fileUploader = require("../helper/fileUpload");
const { FILE_PATH, INVESTOR_TYPE } = require("../config/constant");
const { userUpdateObj } = require("../helper/dataObj");
const { USER_COLLECTION } = require("../config/constant");
const { Dbhelper:dbInstance } = require("../helper/dbHelper");

module.exports = {
    login: async (req, res) => {
        console.log("I am in login controller ");
    },
    logut: async (req, res) => {
        console.log("I am in logout controller ");
    },

    update: async (req, res) => {
        try {
            const { files, data, body } = req
            let { first_name, last_name, address1, address2, city, state, zipCode, investorType
            } = body;

            const updateObj = {
                first_name: first_name,
                last_name: last_name,
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                zipCode: zipCode
                
            };
            
            if (investorType == '2'){
                if (!files){
                    throw new Error("Govt photo Id is mandatory for non Us citizen");
                }
            }
           
            if (files) {
                const { profileImg, govtPhotoId } = files
                if (investorType == '2') {
                    if (!govtPhotoId) {
                        throw new Error("Govt photo Id is mandatory for non Us citizen");
                    }

                    const directoryPath = `${FILE_PATH}govtPhotoId/${data._id}/`
                    const govtPhotoDetails = await fileUploader.upload(govtPhotoId, directoryPath);
                    updateObj.govtPhotoId = govtPhotoDetails;

                }
                if (profileImg) {
                    const directoryPath = `${FILE_PATH}profileImg/${data._id}`
                    const profileImgDetails = await fileUploader.upload(profileImg, directoryPath);
                    updateObj.profileImg = profileImgDetails;
                }
            }
            console.log(investorType,'llllllllllllllll')
            console.log(INVESTOR_TYPE[investorType],'sssssssssssss');
            updateObj.investorType = INVESTOR_TYPE[investorType];
           
            let userDoc = userUpdateObj(updateObj)
            let inserted = await dbInstance.updateDocument(USER_COLLECTION, data._id, userDoc);
            console.log(inserted);
            return _handleResponse(req, res, null, 'updated sucessfully')
        }
        catch (e) {
            return _handleResponse(req, res, e)
        }
    },


    userDetails: async (req, res) => {
        try {
            const { data } = req
            let userDetails = await dbInstance.getDocumentById(data._id);
            return _handleResponse(req, res, null, userDetails)
        }
        catch (e) {
            return _handleResponse(req, res, e)
        }
    }

}