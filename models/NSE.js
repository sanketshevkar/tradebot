
const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    companyName: String,
    purpose: String,
    exDate: String,
    recordDate: String,
    BCstartDate: String,
    BCendDate: String,
    NDendDate: String,
    NDendDate: String,
    dateCrawled: Date
});
 

module.exports = NSE = mongoose.model('NSE', userSchema);;