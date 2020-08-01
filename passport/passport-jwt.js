const JwtStrategy = require('passport-jwt').Strategy
const JwtExtractor = require('passport-jwt').ExtractJwt
const UserSchema = require('../models/UserSchema')

module.exports = (passport) =>
    passport.use(
        'jwt',
        new JwtStrategy(
            {
                jwtFromRequest: JwtExtractor.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET,
            },
            (jwt_payload, done) => {
                const { sub, expires, issuer } = jwt_payload
                const today = new Date()
                const expirationDate = new Date(expires)
                if (expirationDate >= today) {
                    if (issuer === process.env.JWT_ISSUER) {
                        return UserSchema.findOne({ _id: sub })
                            .then((user) => {
                                if (!user) return done('Unable to auth user.')
                                return done(null, true)
                            })
                            .catch((error) => done(error))
                    } else {
                        return done('Token expired, please login in again.')
                    }
                } else {
                    return done('Token expired, please login in again.')
                }
            }
        )
    )
