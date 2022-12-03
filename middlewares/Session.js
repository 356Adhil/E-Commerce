module.exports = {
  verifyUser: (req, res, next) => {
    if (req.session.email) {
      res.redirect("/home");
    } else {
      next();
    }
  },
};
