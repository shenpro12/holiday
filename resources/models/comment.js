const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const comment = new Schema({
    userid: String,
    pertain: String,
    content: String,
    time: String
});
module.exports = mongoose.model('comments', comment);