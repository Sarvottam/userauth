var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// group by userid to get user wise investment
var investmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'UserModel' },
  propertyId: { type: Schema.Types.ObjectId, ref: 'PropertyModel' },
  investedDate: { type: Date, default: Date.now },
  investedAmount: { type: Schema.Types.Decimal128 }
});

module.exports = {
  "InvestmentSchema": mongoose.model('InvestmentSchema', investmentSchema)
}
