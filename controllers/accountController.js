const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const otpModel = require("../models/otpModel");
const bcrypt = require("bcrypt");
const { sendOtpEmail } = require("../services/mailServiece");
const { generateOtp, otpExpiry } = require("../utils/otpGenrator");

module.exports = {
  async whenProfileLoad(req, res) {
    try {
      const currentUser = req.session.currentEmail;
      const user = await userModel.findOne({ email: currentUser });
      res.render("accounts", { user });
    } catch (err) {}
  },
  async whenUserUpdate(req, res) {
    try {
      const { username, email, phone } = req.body;
      const currentUser = await userModel.findOne({
        email: req.session.currentEmail,
      });
      const isEmailExist = await userModel.findOne({
        email,
        _id: { $ne: currentUser._id },
      });
      const isUsernameExist = await userModel.findOne({
        username,
        _id: { $ne: currentUser._id },
      });
      if (isUsernameExist) {
        return res.status(409).json({
          type: "username",
          msg: "Username already exist",
          val: false,
        });
      } else if (isEmailExist) {
        return res
          .status(409)
          .json({ type: "email", msg: "Email already exist", val: false });
      }
      const updateData = { username, email };
      if (phone) updateData.phone = phone;
      await userModel.updateOne({ _id: currentUser._id }, updateData);
      req.session.currentUsername = username;
      req.session.currentEmail = email;
      const updatedUser = await userModel.findOne({ _id: currentUser._id });
      return res.status(200).json({ val: true, user: updatedUser });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ val: false });
    }
  },
  whenForgotPassLoad(req, res) {
    res.render("forgot");
  },
  async whenForgetPassRequest(req, res) {
    console.log("Rex");
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return res
          .status(409)
          .json({
            msg: "Email not found; please enter a valid email.",
            val: false,
          });
      }
      await otpModel.deleteMany({ email });
      const otp = generateOtp();
      await otpModel.create({
        email: user.email,
        otp,
        createdAt: Date.now(),
        expiresAt: otpExpiry,
      });
      await sendOtpEmail(user.email, otp);
      return res
        .status(409)
        .json({ msg: "OTP successfull sended.", val: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ val: false });
    }
  },

  async whenForgetPassverify(req, res) {
    const { email, otp } = req.body;
    try {
      const otpRecord = await otpModel.findOne({ email });
      if (otpRecord && otpRecord.otp === otp) {
        return res.status(200).json({ val: true, msg: null });
      } else {
        return res.status(400).json({ val: false, msg: "Enter a valid OTP" });
      }
    } catch (err) {
      res.status(500).json({ val: false });
      console.log(err);
    }
  },
  async whenForgetPassChange(req, res) {
    const { password, email } = req.body;
    try {

      console.log(password, email);
      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.updateOne({ email }, { password: hashedPassword });
      return res.status(200).json({ val: true, msg: null });
    } catch (err) {
      res.status(500).json({ val: false, msg: "Something went wrong" });
      console.log(err);
    }
  },
  async whenAddressLoad(req, res) {
    try {
      const currentUser = await userModel.findOne({
        email: req.session.currentEmail,
      });
      if (!currentUser) {
        return res.status(409).json({
          msg: "user not found",
          val: false,
        });
      }
      return res.status(200).json({ val: true, user: currentUser.address });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ val: false });
    }
  },
  async whenAddressCreate(req, res) {
    const {
      pincode,
      houseno,
      landmark,
      city,
      street,
      district,
      state,
      country,
    } = req.body;
    console.log(req.body);
    try {
      let currentUser = await userModel.findOne({
        email: req.session.currentEmail,
      });
      if (!currentUser) {
        return res.status(500).json({ val: false, msg: "User not found" });
      }
      await userModel.updateOne(
        { email: currentUser.email },
        {
          $push: {
            address: {
              country,
              state,
              district,
              street,
              landMark: landmark,
              houseNumber: houseno,
              pinCode: pincode,
              city,
            },
          },
        }
      );
      return res.status(200).json({ val: true });
    } catch (err) {
      return res.status(500).json({ val: false });
    }
  },
  async whenEditAddressLoad(req, res) {
    const { addressId } = req.params;
    try {
      const address = await userModel.findOne({ "address._id": addressId });
      if (!address) {
        return res
          .status(404)
          .json({ val: false, message: "Address not found" });
      }
      res.status(200).json({ val: true, address });
    } catch (err) {
      res.status(500).json({ val: false });
    }
  },
  async whenEditAddress(req, res) {
    const {
      id,
      pincode,
      houseno,
      landmark,
      city,
      street,
      district,
      state,
      country,
    } = req.body;

    try {
      const addressUpdate = await userModel.updateOne(
        { "address._id": id },
        {
          $set: {
            "address.$.pinCode": pincode,
            "address.$.houseNumber": houseno,
            "address.$.landMark": landmark,
            "address.$.city": city,
            "address.$.street": street,
            "address.$.district": district,
            "address.$.state": state,
            "address.$.country": country,
          },
        }
      );

      if (!addressUpdate.matchedCount) {
        // Check if any document was updated
        return res
          .status(404)
          .json({ val: false, message: "Address not found" });
      }

      res.status(200).json({ val: true, address: addressUpdate });
    } catch (err) {
      console.log("Error in updating address:", err);
      res.status(500).json({ val: false, message: "Internal server error" });
    }
  },
  async whenDeleteAddress(req, res) {
    const { addressId } = req.params;
    try {
      const address = await userModel.findOne({ "address._id": addressId });
      if (!address) {
        return res
          .status(404)
          .json({ val: false, message: "Address not found" });
      }
      await userModel.updateOne(
        { "address._id": addressId },
        { $pull: { address: { _id: addressId } } }
      );
      res.status(200).json({ val: true });
    } catch (err) {
      console.log("Error in updating address:", err);
      res.status(500).json({ val: false, message: "Internal server error" });
    }
  },
  async whenChangePassword(req, res) {
    const { currentPass, newPass } = req.body;
    const { currentEmail } = req.session;
    try {
      const user = await userModel.findOne({ email: currentEmail });
      const isPassValid = await bcrypt.compare(currentPass, user.password);
      if (!isPassValid) {
        return res
          .status(404)
          .json({
            val: false,
            msg: "The current password entered is incorrect.",
          });
      }
      const hashedPass = await bcrypt.hash(newPass, 10);
      await userModel.updateOne(
        { email: currentEmail },
        { $set: { password: hashedPass } }
      );
      res.status(200).json({ val: true });
    } catch (err) {
      console.log("Error in updating address:", err);
      res.status(500).json({ val: false, message: "Internal server error" });
    }
  },
};
