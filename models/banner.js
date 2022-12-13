const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
  })

const bannerSchema = new Schema({
    head: {
        type: String,
        required: true
    },
    subHead: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bannerImage: [{
        url: String,
        filename: String,
      }],
});

const banner = mongoose.model("banners", bannerSchema);
module.exports = banner;
