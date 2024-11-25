const vistorsModel = require("../models/visitorModel");

const trackVisitors = async (req, res, next) => {
  if (!req.session.visited) {
    req.session.visited = true;
    const today = new Date().toISOString().split("T")[0];
    console.log(today);
    let visitorData = await vistorsModel.findOne({ date: today });
    if (!visitorData) {
      visitorData = new vistorsModel({
        date: today,
        uniqueVisitors: 1,
        totalViews: 1,
      });
    } else {
      visitorData.uniqueVisitors += 1;
      visitorData.totalViews += 1;
    }
    await visitorData.save();
    return next();
  }
  next();
};

module.exports = trackVisitors;
