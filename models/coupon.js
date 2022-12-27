const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const couponSchema = new Schema(
  {
    couponName: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    maxLimit: {
      type: Number,
      required: true,
    },
    startDate: {
      type: String,
      
    },
    expiryDate: {
      type: String,
    },
    users: {
      type:ObjectId,
      rel:'users'
    }
  },
  {
    timestamps: true,
  }
);
const coupon = mongoose.model("coupon",couponSchema);
module.exports = coupon;

0