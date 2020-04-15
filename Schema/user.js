var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email: { type: String, required: [true, 'email not found'] }, // String is shorthand for {type: String}
  password: { type: String, required: [true, 'email not found'] },
  role: [String],
  dob: Date,
  mobile:String,
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  kycDocs: [{ type: String }],
  active: { type: Boolean, default: false },
  kycVerified: {
    type: String,
    enum: ['Not Uploaded', 'Pending', 'Rejected', 'Approved'],
    default: 'Not Uploaded'
  },

  propertiesInvestdIn: [{
    propertyId: { type: Schema.Types.ObjectId, ref: 'PropertyModel' },
    amount: Schema.Types.Decimal128
  }],
  address: {
    address1: String,
    address2: String,
    city: String,
    state: String,
    zipCode: String
  },
  profileImg: {
    filePath: String,
    mimeType: String,
    name: String
  },
  govtPhotoId: {
    filePath: String,
    mimeType: String,
    name: String
  },
  investorType: {
    type: String,
    enum: ['US Citizen & accedited', 'US Citizen & not accedited', 'not US Citizen'],
  },
  resetPasswordJwt :String
});

module.exports = {
  "UserModel": mongoose.model('UserModel', userSchema)
}
