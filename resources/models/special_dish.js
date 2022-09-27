const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const specialty_dish = new Schema({
    name: String,
    id: Number,
    thumb_url: String
});
module.exports = mongoose.model('specialty_dishs', specialty_dish);