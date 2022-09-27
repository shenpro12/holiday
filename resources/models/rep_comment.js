const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rep_comment = new Schema({
    userid: String,
    pertain: String,
    content: String,
    time: String
});
module.exports = mongoose.model('rep_comments', rep_comment);