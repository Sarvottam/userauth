const { DB_STAGING_URI, DB_NAME, USER_COLLECTION } = require("../config/constant");
const mongoose = require('mongoose');
const { UserModel } = require("../Schema/user")


class Dbhelper {

  constructor() {
    ( async() => {
      if (!this.db) {
        console.log("Data Base Initialization ")
        try {
          await mongoose.connect(`${DB_STAGING_URI}`, { useNewUrlParser: true });
          this.db = mongoose.connection;
          console.log("MongoClient Connection successfull.");
          return;
          // onSuccess();
        }
        catch (ex) {
          console.log("Error caught,", ex);
          // throw Error(ex)
          // onFailure(ex);
        }
      }
    })();
  }

  async getPendingKyc() {
    try {
      return await UserModel.find({
        kycVerified: 'Pending',
      })
    }
    catch (ex) {
      console.log("Error caught,", ex);
      throw Error(ex)
      // onFailure(ex);
    }

  }

  async insertDocument(coll, docObj) {
    try {
      if (Object.keys(docObj).length === 0 && docObj.constructor === Object) {

        throw Error("mongoClient.insertDocumentWithIndex: document is not an object");
      }
      var userInstance = new UserModel(docObj);
      return await userInstance.save()
      // return await this.db.collection(coll).insertOne(docObj);
    }
    catch (e) {
      console.log("mongoClient.insertDocumentWithIndex: Error caught,", e);
      throw Error(e)
    }
  }

  async updateDocument(coll, _id, data) {
    console.log(_id, data)
    try {
      return await UserModel.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(_id),
      }, data, { new: false })
    } catch (e) {
      console.log("eeeeee ", e);
      throw (e)
    }
  }

  async insertDocumentWithoutIndex(docObj) {
    if (!docObj) {
      throw Error("doc not found ");
    }
    return await this.db.collection(USER_COLLECTION).insertOne(docObj)
  }

  async getDocumentByEmail(email) {
    try {
      console.log("Here is userData ",email)
      let userData = await UserModel.findOne({ email })
      
      // if(!userData) throw("Email not found")
      return userData
    } catch (e) {
      console.log("eeeeee ", e);
      throw (e)
    }
  }

  async ifTokenExist(resetPasswordJwt) {
    try {
      let userData = await UserModel.findOne({ resetPasswordJwt })
      // if(!userData) throw("Email not found")
      return userData
    } catch (e) {
      console.log("eeeeee ", e);
      throw (e)
    }
  }

  async getDocumentById(_id) {
    try {
      let userData = await UserModel.findOne({
        _id: mongoose.Types.ObjectId(_id)
      }, 'profileImg _id govtPhotoId kycUploded name investorType address'
      )
      // if(!userData) throw("Email not found")
      return userData
    } catch (e) {
      console.log("eeeeee ", e);
      throw (e)
    }
  }

  async close() {
    return await this.db.close()
  }

  async createIndex(coll) {
    console.log("Follow up for create Index")
    return await this.db.collection(coll).createIndex(
      { email: 1 },
      { collation: { locale: "fr" }, unique: true },
    )
  }
}

module.exports = {
  Dbhelper: new Dbhelper(),
}
