const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const image = new Schema({
    thumb_url: String,
})
const destination = new Schema({
    name: String,
    description: String,
    location: String,
    price: String,
    lat: Number,
    long: Number,
    id: Number,
    thumb_url: String,
    images: [image],

});
module.exports = mongoose.model('destination', destination);