# How To Build A Login System with NodeJS and PassportJS

In this tutorial we will be building a Authentication System using PassportJS. Passport is a Node.js middleware that can be implemented  into any Express based web application. Passport allows you to use over 500+ authentication strategies, including Google, Facebook, Amazon, Spotify, Github, Instagram, Twitch and many more.

Today we will go over the basics of PassportJS. We will start by setting up a simple Express application the code for which and be found in *_./index.js_* or below.

## Simple Express App | *_./index.js_*

The first thing we need to do is bring in our required dependencies.

```javascript
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
```

Next we need to connect to our MongoDB database using mongoose. The connection string is located in the *_.env_* file in the projects root directory

```javascript
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (error) =>
        error ? console.log(error) : console.log('Connected to database...')
)
```

After we have connected to the database we can initialize our Express App, assign a port number as well as configure our middleware.

```javascript
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (error) =>
        error ? console.log(error) : console.log('Connected to database...')
)

const app = express()
const port = process.env.SERVER_PORT || 4001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
```

Finally lets define a default/home route and tell our app to listen on the port we have defined.

```javascript
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (error) =>
        error ? console.log(error) : console.log('Connected to database...')
)

const app = express()
const port = process.env.SERVER_PORT || 4001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.status(200).send('Hello From Express'))

app.listen(port, (error) =>
    error ? console.log(error) : console.log('Server running on port:', port)
)
```

## Users Database Schema | *_./models/UserSchema.js_*

Now that our Express server is up and running we can build our database schema for our users. If you would like to make sure our express server is running we can run

```cli
node ./index.js
```
or if you cloned or forked this project you can run

```cli
npm run dev
```

which will run nodemon and restart the server anytime we save a new change. you should now be able to go to *_http://localhost:4001/_* and see "Hello From Express" with the server running lets build our Schema. I'm not going to go over this much at all, but if you feel lost I have included the documents to mongoose at the bottom. So lets define and export our UserSchema

```javascript
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
```
I know I said I wouldn't go over each line of the UserSchema code, but I do want to touch on one thing. We use bcrypt.js to hash the passwords stored in the database. This is a fairly simple process but it is good to know how mongoose methods work and how to compare bcrypt hashes. Once again I have include the documentation to some of the libraries we are using below.

## Integrating PassportJS | *_./passport/passport.js_*

The first thing we need to do is configure passport and the serialize and deserialize methods. These are used for session based auth. We will be implementing token based auth; but we should still configure them just in case you end up using a strategy which uses session based auth or you decide to session based auth in the future.

```javascript
const UserSchema = require('../models/UserSchema')

module.exports = (passport) => {
    passport.serializeUser((user, done) => done(null, user._id))

    passport.deserializeUser((id, done) =>
        UserSchema.findOne({ _id: id }).then((user) => done(null, user))
    )
}
```

As you can see above we require our UserSchema and export an arrow function which takes passport as a parameter. This allows us to separate our files and keep our code base clean. I'm not going to go over how serialize and deserialize works because I fell I would not be able to explain it very well. I have included a link to a StackOverflow post which does a great job explaining  serialize and deserialize.

## Adding Passport Middleware To Express

Once we have configured Passport we need to add the middleware to our Express App back in the *_./index.js_* file we need to add two lines.

```javascript
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (error) =>
        error ? console.log(error) : console.log('Connected to database...')
)

const app = express()
const port = process.env.SERVER_PORT || 4001
// Require our passport configuration and pass passport as an argument
require('./passport/passport')(passport)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Initializes the passport middleware
app.use(passport.initialize())

require('./routes/index')(app)
require('./routes/auth/login')(app, passport)
require('./routes/auth/validate')(app, passport)
require('./routes/auth/signup')(app)

app.listen(port, (error) =>
    error ? console.log(error) : console.log('Server running on port:', port)
)

```

As you can see we added two lines. One requires our passport configuration and passes passport as an argument. The second initializes the passport middleware. That's it now we have a simple Express App/Server and have configured PassportJS.

Now we just need to create a few routes and configure two passport strategies and our login system is complete. Lets start with a sign up route so we can create new users.

## Server Routes | *_./routes/auth/signup.js_*

Lets create kind of a boilerplate for our routes it will look something like this.

```javascript
const UserSchema = require('../../models/UserSchema')
const { check, validationResult } = require('express-validator')

module.exports = (app) => 
    app.post('/', [], (req, res) => {

    })
```
This will be out route boilerplate so lets modify it to make our sign up route.

Let's start by ching the route from *_"/"_* to *_"/signup"_* and add express-validator to validate and sanitize the data coming from the request body

```javascript
const UserSchema = require('../../models/UserSchema')
const { check, validationResult } = require('express-validator')

module.exports = (app) => 
    app.post('/', [
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
    ], (req, res) => {

    })
```

Now that we have express-validator working we need to check for errors and send them back to the user. So let do that..

```javascript
const UserSchema = require('../../models/UserSchema')
const { check, validationResult } = require('express-validator')

module.exports = (app) => 
    app.post('/', [
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
    ], (req, res) => {
        const validationErrors = validationResult(req)
        if (!validationErrors.isEmpty())
            return res.status(418).send({ success: false, errors: validationErrors.array() })

    })
```

FINISH README