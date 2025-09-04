const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id); // Look up the user from req.session
    res.render('applications/index.ejs', {    // Render index.ejs, passing in all of the current user's
      applications: currentUser.applications,   // applications as data in the context object
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');      // If any errors, log them and redirect back home
  }
});

router.get('/new', async (req, res) => {
  res.render('applications/new.ejs');
});

router.get('/:applicationId', async (req, res) => {
  try {           // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);  // Find the application by the applicationId supplied from req.params
    res.render('applications/show.ejs', {   // Render the show view, passing the application data in the context object
      application: application,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');      // If any errors, log them and redirect back home
  }
});

router.post('/', async (req, res) => {
  try {                            // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Push req.body (the new form data object) to the applications array of the current user
    currentUser.applications.push(req.body);
    await currentUser.save();               // Save changes to the user
    res.redirect(`/users/${currentUser._id}/applications`);   // Redirect back to the applications index view
  } catch (error) {           // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');
  }
});

router.delete('/:applicationId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);  // Look up the user from req.session
    // Use the Mongoose .deleteOne() method to delete
    currentUser.applications.id(req.params.applicationId).deleteOne();  // an application using the id supplied from req.params
    await currentUser.save();   // Save changes to the user
    res.redirect(`/users/${currentUser._id}/applications`);   // Redirect back to the applications index view
  } catch (error) {
    console.log(error);
    res.redirect('/');    // If any errors, log them and redirect back home
  }
});

module.exports = router;