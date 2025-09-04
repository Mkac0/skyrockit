const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const isSignedIn = require('./middleware/is-signed-in.js');             // require our new middleware!
const passUserToView = require('./middleware/pass-user-to-view.js');
const applicationsController = require('./controllers/applications.js');

const authController = require('./controllers/auth.js');

const port = process.env.PORT ? process.env.PORT : '3000';

const path = require('path');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));

// new code below this line to start adding style ---
app.use(express.static(path.join(__dirname, 'public')));
// new code above this line ---

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// The passUserToView middleware should be included before all our routes
app.use(passUserToView); // use new passUserToView middleware here

app.get('/', (req, res) => {
  if (req.session.user) {                                 // Check if the user is signed in
    res.redirect(`/users/${req.session.user._id}/applications`);  // Redirect signed-in users to their applications index
  } else {
    res.render('index.ejs');                  // Show the homepage for users who are not signed in
  }
});

app.use('/auth', authController);
app.use(isSignedIn); // use new isSignedIn middleware here
app.use('/users/:userId/applications', applicationsController); // New!

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
