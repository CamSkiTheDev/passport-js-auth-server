module.exports = (app, passport) =>
    app.post('/login', (req, res) => {
        passport.authenticate('local-login', (error, user, token) => {
            if (error || !token || !user)
                return res.status(401).send({
                    success: false,
                    errors: [{ msg: error ? error : 'Unable to auth user.' }],
                })

            return res
                .status(200)
                .send({ success: true, payload: { user, token } })
        })(req, res)
    })
