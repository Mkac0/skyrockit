const passUserToView = (req, res, next) => {                        // PASSING USER'S VIEW
  res.locals.user = req.session.user ? req.session.user : null;
  next();                                                               // NEXT, B/C WE NEED THIS TO CONTINUE ON
};

module.exports = passUserToView;

