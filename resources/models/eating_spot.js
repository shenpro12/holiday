const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const image = new Schema({
    thumb_url: String,
})
const eating_spot = new Schema({
    name: String,
    phone: String,
    open: String,
    location: String,
    description: String,
    lat: Number,
    long: Number,
    thumb_url: String,
    images: [image],

});
module.exports = mongoose.model('eating_spots', eating_spot);