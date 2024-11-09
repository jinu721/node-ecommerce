const mongoose = require("mongoose");
const connect = require("../config/mongo");

connect();

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: Number },
  address: [{
    street: { type: String },
    country: { type: String },
    state: { type: String },
    district: { type: String },
    city: { type: String },
    houseNumber: { type: Number },
    landMark: { type: String },
    pinCode: { type: String },
  }],
  role: { type: String, default: "user" },
  isDeleted: { type: Boolean, default: false },
  isGoogleLogin: { type: Boolean, default: false },
  googleId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Users", userSchema);
