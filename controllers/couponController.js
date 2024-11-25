const couponModel = require("../models/couponModel");

module.exports = {
  async couponAdminPageLoad(req, res) {
    try {
      const currentPage = parseInt(req.query.page) || 1;
      const couponsPerPage = 10;
      const totalCoupons = await couponModel.countDocuments();
      const totalPages = Math.ceil(totalCoupons / couponsPerPage);
      const coupons = await couponModel
        .find({})
        .skip((currentPage - 1) * couponsPerPage) 
        .limit(couponsPerPage); 
      res.render("coupensManagment", {
        coupons,
        currentPage,
        totalPages,
        pagesToShow: 5 
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
  ,
  async couponAdminCreatePageLoad(req, res) {
    res.render("couponCreate");
  },
  async couponAdminCreate(req, res) {
    const { couponCode, discountValue, validFrom, validUntil, usageLimit, minPurchase, maxDiscount } = req.body;
    try {
      if (
        !couponCode ||
        !discountValue ||
        !validFrom ||
        !validUntil ||
        !usageLimit ||
        !minPurchase ||
        !maxDiscount
      ) {
        return res.status(400).json({ val: false,isCodeError:false, msg: "All fields are required" });
      }
      
      const isCouponExist = await couponModel.findOne({code:couponCode});
      if(isCouponExist){
        return res.status(400).json({ val: false,isCodeError:true, msg: "Coupen code already exist" });
      }
  
      const discountType = /%/.test(discountValue) ? "percentage" : "flat";
  
      await couponModel.create({
        code: couponCode,
        discountValue: parseInt(discountValue.replace("%", "").trim()),
        startDate: validFrom,
        endDate: validUntil,
        discountType,
        usageLimit,
        minPurchase: Number(minPurchase),
        maxDiscount: Number(maxDiscount),
      });
  
      res.status(200).json({ val: true, msg: null });
    } catch (err) {
      console.log(err);
      res.status(500).json({ val: false,isCodeError:false, msg: err.message });
    }
  },
  async couponAdminUpdatePageLoad(req, res) {
    const {couponId} = req.params
    try{
      const coupon = await couponModel.findOne({_id:couponId});
      if(!coupon){
        return res.status(400).json({msg:'Coupon not found!'});
      }
      res.status(200).render('couponUpdate',{coupon});
    }catch(err){
      console.log(err);
    }
  },
  async couponAdminUpdate(req, res) {
    const { couponCode, discountValue, validFrom, validUntil, usageLimit, minPurchase, maxDiscount } = req.body;
    const {couponId} = req.params;
    try {
      if (
        !couponCode ||
        !discountValue ||
        !validFrom ||
        !validUntil ||
        !usageLimit ||
        !minPurchase ||
        !maxDiscount
      ) {
        return res.status(400).json({ val: false,isCodeError:false, msg: "All fields are required" });
      }
      
      const isCouponExist = await couponModel.findOne({code:couponCode,_id:{$ne:couponId}});
      if(isCouponExist){
        return res.status(400).json({ val: false,isCodeError:true, msg: "Coupen code already exist" });
      }
  
      const discountType = /%/.test(discountValue) ? "percentage" : "flat";
  
      await couponModel.findByIdAndUpdate(couponId,{
        code: couponCode,
        discountValue: parseInt(discountValue.replace("%", "").trim()),
        startDate: validFrom,
        endDate: validUntil,
        discountType,
        usageLimit,
        minPurchase: Number(minPurchase),
        maxDiscount: Number(maxDiscount),
      });
  
      res.status(200).json({ val: true, msg: null });
    } catch (err) {
      console.log(err);
      res.status(500).json({ val: false,isCodeError:false, msg: err.message });
    }
  },
  async couponAdminDelete(req, res) {
    const {couponId} = req.params;
    try {
      const isCouponExist = await couponModel.findOne({_id:couponId});
      if(!isCouponExist){
        return res.status(400).json({ val: false, msg: "Coupen not exist" });
      }

      await couponModel.deleteOne({_id:couponId});
  
      res.status(200).json({ val: true, msg: null });
    } catch (err) {
      console.log(err);
      res.status(500).json({ val: false, msg: err.message });
    }
  },
  async couponApply(req, res) {
    const { couponCode, totalPrice } = req.body;
    try {
      console.log(couponCode);
      
      const coupon = await couponModel.findOne({ code: couponCode });
      if (!coupon) {
        return res
          .status(400)
          .json({ val: false, msg: "Enter a valid coupon code" });
      }
      console.log(1)
      const currentDate = new Date();
      const startDate = new Date(coupon.startDate);
      const endDate = new Date(coupon.endDate);
      if (coupon.usageLimit === 0) {
        return res
        .status(400)
        .json({ val: false, msg: "coupon limit exceeds" });
      }
      console.log(2)
      if (currentDate < startDate) {
        return res
        .status(400)
        .json({ val: false, msg: "Coupon is not yet active" });
      }
      console.log(3)
      if (currentDate > endDate) {
        return res.status(400).json({ val: false, msg: "Coupon has expired" });
      }
      if (totalPrice < coupon.minPurchase) {
        return res.status(400).json({val: false,msg: `Minimum purchase amount is ${coupon.minPurchase}`,});
      }
      
      if(coupon.usedCount>=coupon.usageLimit){
        return res.status(400).json({val: false,msg: `Purchase limit reached`});
      }
      
      console.log(4)
      
      let discountedPrice = totalPrice;
      
      if (coupon.discountType === "percentage") {
        const discountPercentage = parseFloat(coupon.discountValue); 
        let discountAmount = (totalPrice * discountPercentage) / 100;
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
        discountedPrice = totalPrice - discountAmount;
      } else if (coupon.discountType === "flat") {
        const flatDiscount = parseFloat(coupon.discountValue); 
        discountedPrice = totalPrice - flatDiscount;
      }
      
      console.log(5)
      discountedPrice = Math.max(discountedPrice, 0);
      coupon.usedCount += 1;
      coupon.markModified('usedCount');
      console.log(6)
      await coupon.save();
      console.log(7)
      res.status(200).json({val: true,msg: "Coupon applied successfully",originalPrice: totalPrice,discountedPrice });
    } catch (err) {
      console.log(err);
      res.status(500).json({ val: false, msg: err });
    }
  },
};
