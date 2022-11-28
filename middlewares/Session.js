module.exports = {
    verifyAdmin: (req, res, next) => {
      if (req.session.adminId) {
        next();
      } else {
        res.redirect("/admin");
      }
    },
    verifyUser:(req,res,next)=>{
      if(req.session.email){
        res.redirect('/home');
      }else{
        next();
      }
    }
    }