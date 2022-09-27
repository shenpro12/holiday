const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hotelService = new Schema({
    thumb_url: String,
    name: String
});
module.exports = mongoose.model('hotelservices', hotelService);