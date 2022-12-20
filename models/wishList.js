const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectID = schema.ObjectId;

const wishlistSchema = new schema({
  user_Id: {
    type: ObjectID,
    required: true,
  },
  products: [
    {
      product_Id: {
        type: ObjectID,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
    },
  ],
});

const wishlist = mongoose.model("wishlist", wishlistSchema);
module.exports = wishlist;
