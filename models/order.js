const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;

const orderSchema = new schema({
  user_Id: {
    type: ObjectId,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  orderItem: [
    {
      product_Id: {
        type: ObjectId,
      },
      quantity: {
        type: Number,
      },
    },
  ],
  totalAmount: {
    type: Number,
  },
  orderStatus: {
    type: String,
    default: "pending",
  },

  paymentStatus: {
    type: String,
    default: "not paid",
  },
  deliveryDate: {
    type:String,
  },
  orderOn: {
    type: String,
  },
  deliveryDate: {
    type: String,
  },
});
const order = mongoose.model("order", orderSchema);
module.exports = order;
