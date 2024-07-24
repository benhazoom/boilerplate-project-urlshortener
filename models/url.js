const mongoose = require('mongoose');
//schema constructor
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
  }
});

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;