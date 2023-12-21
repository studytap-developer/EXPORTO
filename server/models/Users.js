const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
    companyName: String,
    phoneNumber: String,
    companyEmail: String,
    registerDate: { type: Date, default: Date.now }
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;


