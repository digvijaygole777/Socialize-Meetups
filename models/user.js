var mongoose = require('mongoose');

module.exports = class User {
    constructor(userId, userFirstName, userLastName, userEmail, password, addressfield, userCity, userState, userZipCode) {
        this.userId = userId;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.userEmail = userEmail;
        this.password = password;
        this.addressfield = addressfield;
        this.userCity = userCity;
        this.userState = userState;
        this.userZipCode = userZipCode;

    }
}

module.exports.userSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    userFirstName: { type: String, required: true },
    userLastName: { type: String, required: true },
    userEmail: String,
    password: String,
    addressfield: String,
    userCity: String,
    userState: String,
    userZipCode: Number,

}, {
    versionKey: false
});