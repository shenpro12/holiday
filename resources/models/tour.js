const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const startlocation = new Schema({
    location: String,
    days: Number
});
const image = new Schema({
    thumb_url: String
});
const tour = new Schema({
    name: String,
    id: Number,
    thumb_url: String,
    description: String,
    price: Number,
    startlocation: startlocation,
    images: [image]
});
module.exports = mongoose.model('tour', tour);