const coupon = require("../../models/coupon");

module.exports = {
    getCoupon: async (req,res)=>{
        try {
            const couponData =  await coupon.find()
            res.render("admin/coupons",{couponData})
        } catch (error) {
            console.log(error);
        }
        
    },

    getAddCoupon: (req,res)=>{
        res.render("admin/addCoupon")
    },

    postAddCoupon: async (req,res)=>{
        try {
         let data = req.body; 
           console.log(data);

       const couponData = coupon.create ({
                couponName: data.coupon,
                discount: data.discount,
                maxLimit: data.maxlimit,
                startDate: data.startdate,
                expiryDate: data.expirydate,
            }).then((err)=>{
                console.log(err);
                res.redirect("/admin/coupon")
            })
                console.log(couponData);
                // res.redirect("/admin/coupons")
            
            
           
        } catch (error) {
            console.log(error);
        }
    }
}