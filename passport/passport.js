const UserSchema = require('../models/UserSchema')

module.exports = (passport) => {
    passport.serializeUser((user, done) => done(null, user._id))

    passport.deserializeUser((id, done) =>
        UserSchema.findOne({ _id: id }).then((user) => done(null, user))
    )

    require('./passport-local')(passport)
    require('./passport-jwt')(passport)
}
