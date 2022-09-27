const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const account = new Schema({
    username: String,
    password: String,
    name: String,
    male: String,
    bird: String,
    location: String,
    work: String,
    mail: String,
    admin: Boolean
});
module.exports = mongoose.model('accounts', account);