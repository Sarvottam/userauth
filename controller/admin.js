const { ADDRESS_NOT_FOUND } = require("../config/constant")
const { KYC_STATUS_ADMIN } = require("../config/constant");
const { Dbhelper:dbInstance } = require("../helper/dbHelper");
const { adminKycObj } = require("../helper/dataObj");
const { USER_COLLECTION } = require("../config/constant");
const mailHelper = require("../helper/mailHelper");


module.exports = {
    login: async (request, response) => {
        console.log("I am in login controller admin ");
        return _handleResponse(request, response, null, "bye")
    },
    logut: async (request, response) => {
        console.log("I am in logout controller  admin");
    },


    pendingKyc: async (req, res) => {
        try {
            let pendingKyc = await dbInstance.getPendingKyc();
            return _handleResponse(req, res, null, pendingKyc)
        }
        catch (e) {
            return _handleResponse(req, res, e)
        }
    },

    approveKyc: async (req, res) => {
        try {
            const { _id, kycStatus } = req.body
     
            if (!kycStatus) {
                throw ("kycStatus is missing")
            }
            const kycVerified = KYC_STATUS_ADMIN[kycStatus];
            let userDoc = adminKycObj({ _id, kycVerified })
            let inserted = await dbInstance.updateDocument(USER_COLLECTION, _id, userDoc);
            if (!inserted) {
                throw ("Id is incorrect")
            }
            else {
                if (kycStatus === "1") {
                    await mailHelper.kycVerified(inserted.email);
                }
                else if (kycStatus === "0"){
                    await mailHelper.kycVerified(inserted.email);
                }
            }
            return _handleResponse(req, res, null, inserted)
        }
        catch (e) {
            console.log('hererere')
            return _handleResponse(req, res, e)
        }
    }
}