const UserSchema = require('../../models/UserSchema')
const { check, validationResult } = require('express-validator')

module.exports = (app) =>
    app.post(
        '/signup',
        [
            check('username', 'Please enter a username.')
                .trim()
                .not()
                .isEmpty()
                .isString()
                .escape(),
            check('email', 'Please enter your email address.')
                .trim()
                .not()
                .isEmpty()
                .isEmail()
                .normalizeEmail()
                .escape(),
            check('password', 'Please enter your password.')
                .trim()
                .not()
                .isEmpty()
                .isString()
                .isLength({ min: 6 })
                .escape(),
        ],
        (req, res) => {
            const validationErrors = validationResult(req)
            if (!validationErrors.isEmpty())
                return res
                    .status(418)
                    .send({ success: false, errors: validationErrors.array() })

            const { username, email, password } = req.body

            UserSchema.findOne({ email: email })
                .then((user) => {
                    if (user)
                        return res.status(418).send({
                            success: false,
                            errors: [
                                {
                                    msg: `Sorry their is already a user with that email in our system`,
                                },
                            ],
                        })

                    const newUser = new UserSchema({ username, email })
                    newUser.password = newUser.hashPass(password)

                    newUser
                        .save()
                        .then((user) =>
                            res.status(200).send({
                                success: true,
                                msg: `Thank you, ${username} you can now login.`,
                            })
                        )
                        .catch((error) => {
                            console.log(error)
                            return res.status(500).send({
                                success: false,
                                errors: [{ msg: 'Server Error: USR-521' }],
                            })
                        })
                })
                .catch((error) => {
                    console.log(error)
                    return res.status(500).send({
                        success: false,
                        errors: [{ msg: 'Server Error: USR-451' }],
                    })
                })
        }
    )
