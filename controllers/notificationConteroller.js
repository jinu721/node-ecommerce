const userModel = require("../models/userModel");
const notifyModel = require("../models/notificationModel");
const moment = require('moment');

module.exports = {
  async notificationPageLoad(req, res) {
    const { currentId } = req.session;
    try {
      const notifications = await notifyModel.find({userId:currentId}).sort({createdAt:-1})
      const notify = notifications.map((data) => ({
        ...data._doc,
        timeAgo: moment(data.createdAt).fromNow(), 
      }));
      console.log(notify)
      res.render("notification",{notify});
    } catch (err) {
      console.log(err);
    }
  },
  async addNotification(req, res) {
    const { currentId } = req.session;
    const { title, message, type,status } = req.body;
    try {
      if (!title || !message || !type) {
        returnres.status(400).json({ val: false, msg: "Invalid fields" });
      }
      await notifyModel.create({
        userId: currentId,
        title: title,
        message: message,
        status:status,
        type: type,
      });
      res.status(200).json({val:true,msg:null});
    } catch (err) {
        console.log(err);
        res.status(500).json({val:false,msg:'Something went wrong'});
    }
  },
  async clearNotification(req, res) {
    const { currentId } = req.session;
    try {
      await notifyModel.deleteMany({userId: currentId});
      res.status(200).json({val:true,msg:null});
    } catch (err) {
        console.log(err);
        res.status(500).json({val:false,msg:'Something went wrong'});
    }
  },
};
