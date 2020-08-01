const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    lastLogin: {
        type: Date,
    },
    timeStamp: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

UserSchema.methods.hashPass = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(12))

module.exports = mongoose.model('user', UserSchema)
