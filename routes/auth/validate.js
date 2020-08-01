module.exports = (app, passport) =>
    app.get('/validate', (req, res) => {
        passport.authenticate('jwt', (error, isAuth_ed) => {
            if (error || !isAuth_ed)
                return res.status(401).send({
                    success: false,
                    errors: [{ msg: error ? error : 'Unable to auth user.' }],
                })

            return res.status(200).send({ success: true })
        })(req, res)
    })
