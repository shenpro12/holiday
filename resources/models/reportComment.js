const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const report_comment = new Schema({
    commentId: String,
    time: String
});
module.exports = mongoose.model('report_comments', report_comment);