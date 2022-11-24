const mongoose = require("mongoose");
const userSignup = require("../controllers/user/userSignup");
const Schema = mongoose.Schema;

const signupSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
});

const User = mongoose.model("users", signupSchema);
module.exports = User;
