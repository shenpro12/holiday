const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const homeBanner = new Schema({
    thumb_url: String,
    name: String,
    description_up: String,
    description_down: String,
    id: String
});
module.exports = mongoose.model('homebanner', homeBanner);