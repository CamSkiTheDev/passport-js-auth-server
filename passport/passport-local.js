const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { addDays } = require('date-fns')
const LocalStrategy = require('passport-local').Strategy
const UserSchema = require('../models/UserSchema')

module.exports = (passport) =>
    passport.use(
        'local-login',
        new LocalStrategy(
            { session: false, usernameField: 'email', passReqToCallback: true },
            (req, email, password, done) =>
                UserSchema.findOne({ email: email })
                    .then((user) => {
                        if (!user) return done('No user found.')

                        if (bcrypt.compareSync(password, user.password)) {
                            return UserSchema.updateOne(
                                { _id: user._id },
                                { $set: { lastLogin: Date.now() } }
                            )
                                .then(() => {
                                    const token = jwt.sign(
                                        {
                                            sub: user._id,
                                            issuer: process.env.JWT_ISSUER,
                                            expires: addDays(Date.now(), 30),
                                        },
                                        process.env.JWT_SECRET
                                    )

                                    return done(null, user, token)
                                })
                                .catch((error) => done(error))
                        } else {
                            return done('Invalid email and password combo.')
                        }
                    })
                    .catch((error) => done(error))
        )
    )
