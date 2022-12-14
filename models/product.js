const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectId;

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String
})

const productSchema = new Schema({
  productId: {
    type: ObjectID,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: [{
    url: String,
    filename: String,
  }],
  qty: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
});

const product = mongoose.model("product", productSchema);
module.exports = product;
