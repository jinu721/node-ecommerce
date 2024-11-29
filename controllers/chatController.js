const userModel = require("../models/userModel");
const tokenModel = require("../models/tokenModel");

module.exports = {
  async chatLoad(req, res) {
    try {
      res.render("chat");
    } catch (err) {
      console.log(err);
    }
  },
  async generateChatToken(req, res) {
    const { reason } = req.body;
    try {
      const generateTokenID = () => Math.random().toString(36).substring(2, 15);
      let tokenId = generateTokenID();
      let token = await tokenModel.findOne({ tokenId });

      while (token) {
        tokenId = generateTokenID();
        token = await tokenModel.findOne({ tokenId });
      }

      console.log(tokenId);
      console.log(reason);

      await tokenModel.create({
        tokenId,
        reason,
        status: "pending",
      });
      console.log('Eda mone')
      res.status(200).json({val:true, tokenId });
    } catch (err) {
      console.log(err);
      res.status(500).json({ val: false, msg: err.message });
    }
  },
};
