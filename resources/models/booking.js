const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const booking = new Schema({
    tourId: String,
    userid: String,
    username: String,
    email: String,
    content: String,
    tittle: String,
    status: Boolean
});
module.exports = mongoose.model('bookings', booking);