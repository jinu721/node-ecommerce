const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  uniqueVisitors: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
});

module.exports = mongoose.model("Visitor", visitorSchema);

