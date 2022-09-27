const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const content = new Schema({
    tittle: String,
    content: String,
    images: String

});
const news = new Schema({
    tittle: String,
    time: String,
    thumb_url: String,
    content: [content]

});
module.exports = mongoose.model('news', news);