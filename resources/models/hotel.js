const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const image = new Schema({
    thumb_url: String,
})
const service = new Schema({
    name: String,
    thumb_url: String
})
const hotel = new Schema({
    thumb_url: String,
    name: String,
    description: String,
    location: String,
    lat: Number,
    long: Number,
    id: Number,
    type: String,
    images: [image],
    service: [service]
});
module.exports = mongoose.model('hotels', hotel);