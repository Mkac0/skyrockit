const isSignedIn = (req, res, next) => {
  if (req.session.user) return next();          // CHECKING IF USER IS SIGNED IN
  res.redirect('/auth/sign-in');                    // IF NOT, GOES BACK TO "SIGN-IN"
};

module.exports = isSignedIn;                    // EXPORT TO USE IT SOMEHWERE ELSE

