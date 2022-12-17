const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

var validateName = function (name) {
  return /^[a-zA-Z]+$/.test(name);
};

const signupSchema = new Schema({
  username: {
    type: String,
    require: true,
    match: [/^[a-zA-Z]+$/, "please fill a valid name"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },

  addressDetails: [
    {
      user_Id: {
        type: ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
      mobileNumber: {
        type: Number,
        required: true,
      },
    },
  ],
});

const User = mongoose.model("users", signupSchema);
module.exports = User;
