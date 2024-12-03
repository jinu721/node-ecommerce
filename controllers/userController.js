const otpModel = require("../models/otpModel");
const mailService = require("../services/mailServiece");
const { generateOtp, otpExpiry } = require("../utils/otpGenrator");
const { sendOtpEmail } = require("../services/mailServiece");
const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');

module.exports = {
  whenRegisterLoad(req, res) {
    res.render("login-register");
  },
  async whenRequestOtp(req, res) {
    const {isLogin} = req.body;
    try {
      if(!isLogin){
        const {username, email} = req.body;
        const isUsernameValid = await userModel.findOne({username});
        const isEmailValid = await userModel.findOne({email});
        if(isUsernameValid){
          return res.status(409).json({type:"username",msg:"Username already exist",val:false});
        }else if(isEmailValid){
          return res.status(409).json({type:"email",msg:"Email already exist",val:false});
        }
        await otpModel.deleteMany({email});
        const otp = generateOtp();
        await sendOtpEmail(email, otp);
        await otpModel.create({
          email,
          otp,
          createdAt: Date.now(),
          expiresAt: otpExpiry,
        });
        console.log("Otp sended successfully");
        return res.status(200).json({val: true });
      }else{
        const {usernameOrEmail, password} = req.body;
        let user;
        if(/@/.test(usernameOrEmail)){
          user = await userModel.findOne({email:usernameOrEmail});
          if(!user){
            return res.status(409).json({type:"username",msg:"Enter a valid email address",val:false});
          }
          await otpModel.deleteMany({email:usernameOrEmail})
        }else{
          user = await userModel.findOne({username:usernameOrEmail});
          if(!user){
            return res.status(409).json({type:"username",msg:"Enter a valid username",val:false});
          }
          await otpModel.deleteMany({email:user.email})
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
          return res.status(409).json({type:"password",msg:"Enter a valid password",val:false});
        }
        if(user.isDeleted){
          return res.status(400).json({type:"ban",msg:"This account has been banned.",val:false});
        }
        const otp = generateOtp(); 
        await otpModel.create({
          email: user.email,
          otp,
          createdAt: Date.now(),
          expiresAt: otpExpiry,
        });
        await sendOtpEmail(user.email, otp);
        req.session.userEmail = user.email;
        console.log("Otp sent successfully");
        return res.status(200).json({ val: true });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ val: false });
    }
  },
  async whenRegister(req, res) {
    const { username, email, phone, password, otp } = req.body;
    try {
      const otpRecord = await otpModel.findOne({ email });
      if (otpRecord && otpRecord.otp === otp) {
        const hashedPass = await bcrypt.hash(password, 10);
        await userModel.create({ username, email, phone, password: hashedPass });
        req.session.loggedIn = true;
        req.session.currentUsername = username;
        req.session.currentEmail = email;
        const user = await userModel.findOne({email});
        req.session.currentId = user._id ;
        return res.status(200).json({ val: true, msg: null });
      } else {
        return res.status(400).json({ val: false, msg: "Enter a valid OTP" });
      }
    } catch (err) {
      res.status(500).json({ val: false });
      console.log(err);
    }
  },
  async whenLogin(req, res) {
    const { usernameOrEmail, otp } = req.body;
    try {
      let user;
      if(/@/.test(usernameOrEmail)){
        user = await userModel.findOne({email:usernameOrEmail});
      }else{
        user = await userModel.findOne({username:usernameOrEmail});
      }
      const otpRecord = await otpModel.findOne({email:user.email});
      if (otpRecord.otp === otp) {
        req.session.loggedIn = true;
        req.session.currentUsername = user.username;
        req.session.currentEmail = user.email;
        req.session.currentId = user._id ;
        return res.status(200).json({ val: true, msg: null });
      } else {
        return res.status(400).json({ val: false, msg: "Enter a valid OTP" });
      }
    } catch (err) {
      res.status(500).json({ val: false });
      console.log(err);
    }
  },
  async banPageLogin(req,res){
    // try{
      
    // }catch(err){

    // }
    res.render('ban')
  },
  logoutClick(req,res){
    req.session.destroy((err)=>{
      if(err){
        console.log('Error in logout :-'+err)
        res.status(200).json({val:false,msg:"Something went wrong , please try again later"});
      }else{
        console.log('Successfully logouted');
        res.status(200).json({val:true});
      }
    })
  },
  aboutLoad(req, res) {
    res.render("about");
  },
};
