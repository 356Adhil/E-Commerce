module.exports = {
  verifyUser: (req, res, next) => {
    if (req.session.email) {
      res.redirect("/home");
    } else {
      next();
    }
  },

  verifyUserCart: (req, res, next) => {
    if (req.session.email) {
      next();
    } else {
      res.redirect("/home");
    }
  },

  verifyAdmin: (req,res,next)=>{
    if(req.session.adminEmail){
      res.redirect("/admin/home")
    }
    else{
      next();
    }
  },
  verifyAdmin1: (req,res,next)=>{
    if(req.session.adminEmail){
      next();
    }
    else{
      res.redirect("/admin")
    }
  }
};
