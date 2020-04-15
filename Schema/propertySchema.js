var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var propertySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'UserModel' },
  propertyName: String,
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  isPropertyVerified: Boolean,
  active: Boolean,
  deletedByPropertyOwner: Boolean,//if property owner wants to delete at later point of time
  // investors :[{ type: Schema.Types.ObjectId, ref: 'UserModel' , amount:Schema.Types.Decimal128}],
  propertyDocuments: { type: Schema.Types.ObjectId, ref: 'UserModel' },
  propertyCost: { type: Schema.Types.Decimal128 },
  totalCapitalAcquired: { type: Schema.Types.Decimal128 },
  interestRate: { type: Schema.Types.Decimal128 },
  isLocked: Boolean,//untill first investment
  collateralAmount: { type: Schema.Types.Decimal128 },
  investorIntersetRateMapping: [{
    investorId: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    interestRate: { type: Schema.Types.Decimal128 },
    approvedFromAdmin: Boolean
  }]
});

module.exports = {
  "PropertyModel": mongoose.model('PropertyModel', propertySchema)
}
