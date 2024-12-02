const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const orderModel = require("../models/orderModel");
const vistorModel = require("../models/visitorModel");
const visitorModel = require("../models/visitorModel");
const path = require("path");
let pdf = require("html-pdf");
const ejs = require("ejs");
const moment = require("moment");

module.exports = {
  whenDashboardLoad(req, res) {
    res.render("dashboard");
  },
  async dashboardData(req, res) {
    const { range, startDate, endDate } = req.query; 
    try {

      console.log(range,startDate,endDate)

      let start, end;
  
      if (range === "daily") {
        start = moment().startOf("day").toDate();
        end = moment().endOf("day").toDate();
      } else if (range === "weekly") {
        start = moment().startOf("week").toDate();
        end = moment().endOf("day").toDate();
      } else if (range === "monthly") {
        start = moment().startOf("month").toDate();
        end = moment().endOf("day").toDate();
      } else if (range === "custom") {
        start = new Date(startDate); 
        end = new Date(endDate);
      } else {
        return res.status(400).json({ val: false, msg: "Invalid range." });
      }
  
      console.log(start)

      const dateFilter = { createdAt: { $gte: start, $lt: end } };
  
      const [users, products, orders, sales, pendingMoney, categoryData] = await Promise.all([
        userModel.find({...dateFilter}),
        productModel.find({}, "_id"),
        orderModel.find(
          { ...dateFilter, orderStatus: { $not: { $in: ["cancelled", "delivered"] } } },
          "_id"
        ),
        orderModel.aggregate([
          { $match: { ...dateFilter, paymentStatus: "paid" } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
              count: { $sum: 1 },
            },
          },
        ]),
        orderModel.aggregate([
          { $match: { ...dateFilter, paymentMethod: "cash_on_delivery",paymentStatus:'pending' } },
          {
            $group: {
              _id: null,
              totalPendingMoney: { $sum: "$totalAmount" },
              count: { $sum: 1 },
            },
          },
        ]),
        categoryModel.aggregate([
          {
            $lookup: {
              from: "products",
              localField: "_id",
              foreignField: "category",
              as: "products",
            },
          },
          {
            $addFields: {
              productCount: { $size: "$products" },
            },
          },
          {
            $project: {
              name: 1,
              image: 1,
              productCount: 1,
              isDeleted: 1,
            },
          },
        ]),
      ]);
  
      const totalSales = sales[0]?.count || 0;
      const totalRevenue = sales[0]?.totalRevenue || 0;
      const totalPendingMoney = pendingMoney[0]?.totalPendingMoney || 0;
      const topSellingProducts = await orderModel.aggregate([
        { $match: { ...dateFilter, orderStatus: "delivered" } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            totalQuantity: { $sum: "$items.quantity" },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $project: {
            product: { $arrayElemAt: ["$product", 0] },
            totalQuantity: 1,
          },
        },
      ]);

      const topSellingCategories = await orderModel.aggregate([
        { $match: {...dateFilter, orderStatus: "delivered" } },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $group: {
            _id: "$productDetails.category",
            totalQuantity: { $sum: "$items.quantity" },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        { $unwind: "$categoryDetails" },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        {
          $project: {
            category: "$categoryDetails.name",
            totalQuantity: 1,
          },
        },
      ]);

      const topSellingBrands = await orderModel.aggregate([
        { $match: {...dateFilter, orderStatus: "delivered" } },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $group: {
            _id: "$productDetails.brand",
            totalQuantity: { $sum: "$items.quantity" },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        {
          $project: {
            brand: "$_id",
            totalQuantity: 1,
          },
        },
      ]);
      

      const totalDiscounts = await orderModel.aggregate([
        { $match: { ...dateFilter, "coupon.code": { $exists: true } } },
        {
          $group: {
            _id: null,
            totalDiscount: { $sum: "$coupon.discountApplied" },
          },
        },
      ]);

      
  
      const vistors = await visitorModel.find({});
  
      const dashboard = {
        usersCount: users.length,
        productsCount: products.length,
        ordersCount: orders.length,
        totalSalesCount: totalSales,
        totalRevenue,
        totalPendingMoney,
        categories: categoryData,
        totalDiscounts: totalDiscounts[0]?.totalDiscount || 0,
        topSellingProducts,
        topSellingCategories,
        topSellingBrands,
        vistors,
      };
      res.status(200).json({ val: true, dashboard });
    } catch (err) {
      console.error("Error loading dashboard:", err);
      res.status(500).json({
        val: false,
        msg: "An error occurred while loading the dashboard.",
      });
    }
  },
  async downloadReport(req, res) {
    console.log("Processing downloadReport...");
  
    try {
      const { startDate, endDate, range } = req.body;
  
      let start, end;
      const today = new Date();


      if(range==='daily'){
        start = new Date(today.setHours(0, 0, 0, 0));
        end = new Date(today.setHours(23, 59, 59, 999));
      }else if(range==='weekly'){
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        start = new Date(startOfWeek.setHours(0, 0, 0, 0));
        end = new Date(today.setHours(23, 59, 59, 999));
      }else if(range==='monthly'){
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      }else if(range==='custom'){
        if (!startDate || !endDate) {
          return res.status(400).json({ msg: "Start and end dates are required for custom range." });
        }
        start = new Date(startDate);
        end = new Date(endDate);
      }

      console.log(range)
      console.log(startDate,endDate)
      console.log(start,end)
  
      const salesDataResult = await orderModel.aggregate([
        {
          $match: {
            orderStatus: "delivered",
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            totalSales: { $sum: 1 },
            itemsSold: {
              $sum: {
                $sum: "$items.quantity",
              },
            },
          },
        },
      ]);
  
      const salesData = salesDataResult[0] || {
        totalRevenue: 0,
        totalSales: 0,
        itemsSold: 0,
      };
  
      const detailedOrders = await orderModel
        .find({
          orderStatus: "delivered",
          createdAt: { $gte: start, $lte: end },
        })
        .populate("items.product", "name price");

        const totalDiscounts = await orderModel.aggregate([
          { $match: { createdAt: { $gte: start, $lte: end }, "coupon.code": { $exists: true } } },
          {
            $group: {
              _id: null,
              totalDiscount: { $sum: "$coupon.discountApplied" },
            },
          },
        ]);
  
      console.log("Sales Data:", salesData);
      console.log("Number of Detailed Orders:", detailedOrders.length);
  
      const templatePath = path.join(__dirname, "..", "views", "admin", "report-template.ejs");
  
      ejs.renderFile(
        templatePath,
        {
          salesData,
          detailedOrders,
          totalDiscounts: totalDiscounts[0]?.totalDiscount || 0,
          startDate: start.toISOString().split("T")[0],
          endDate: end.toISOString().split("T")[0],  
        },
        (err, renderedHTML) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Error rendering report template." });
          }
      
          const pdfOptions = {
            height: "11.25in",
            width: "8.5in",
            header: { height: "20mm" },
            footer: { height: "20mm" },
          };
      
          pdf.create(renderedHTML, pdfOptions).toFile("report.pdf", (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ msg: "Error generating PDF file." });
            }
            return res.download(result.filename, "SalesReport.pdf", (downloadErr) => {
              if (downloadErr) {
                console.error(downloadErr);
                return res.status(500).json({ msg: "Error downloading PDF file." });
              }
            });
          });
        }
      );
      
    } catch (error) {
      console.error("Error in downloadReport:", error);
      res.status(500).json({ msg: "An error occurred while generating the report." });
    }
  }
  ,
  whenAdminLoginLoad(req, res) {
    res.render("login");
  },
  async whenUsersLoad(req, res) {
    const { page = 1 } = req.query;
    const limit = 7;
    const skip = (page - 1) * limit;
    try {
      const users = await userModel.find().skip(skip).limit(limit);
      const totalUsers = await userModel.countDocuments();
      const totalPages = Math.ceil(totalUsers / limit);
      return res.status(200).render("usersManagement", {
        val: users.length > 0,
        msg: users.length ? null : "No users found",
        user: users,
        currentPage: Number(page),
        totalPages,
        pagesToShow: 3,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).render("usersManagement", {
        val: false,
        msg: "Error loading users",
        users: null,
        currentPage: 1,
        totalPages: 1,
        pagesToShow: 3,
      });
    }
  },
  async whenUsersView(req, res) {
    const { userId } = req.params;
    try {
      console.log(userId);
      const user = await userModel.findOne({ _id: userId });
      res.status(200).json({ user });
    } catch (err) {
      console.log(err);
    }
  },
  async whenUsersBan(req, res) {
    const { id, val } = req.query;
    try {
      console.log(id, val);
      if (val === "Ban") {
        await userModel.updateOne({ _id: id }, { isDeleted: true });
      } else {
        await userModel.updateOne({ _id: id }, { isDeleted: false });
      }
      res.status(200).json({ val: true });
    } catch (err) {
      res.status(500).json({ val: false });
    }
  },
  whenAdminLogin(req, res) {
    const { username, password } = req.body;
    try {
      if (username !== "admin") {
        return res.status(400).json({
          val: false,
          type: "username",
          msg: "Enter a valid username",
        });
      } else if (password !== "admin@123") {
        return res.status(400).json({
          val: false,
          type: "password",
          msg: "Enter a valid password",
        });
      }
      req.session.AdminloggedIn = true;
      return res.status(200).json({ val: true, type: null, msg: null });
    } catch (err) {
      res.status(500).json({ val: false, type: null, msg: err });
    }
  },
  async searchUsers(req, res) {
    const { key } = req.query;
    try {
      const users = await userModel.find({
        $or: [
          { username: { $regex: key, $options: "i" } },
          { email: { $regex: key, $options: "i" } },
        ],
      });
      if (!users) {
        return res.status(400).json({ val: false, msg: "No users found" });
      }
      console.log(users);
      res.status(200).json({ val: true, users });
    } catch (err) {
      console.log(err);
      res.status(500).json({ val: false, msg: "Something went wrong" });
    }
  },
  async searchProducts(req, res) {
    const { key } = req.query;
    try {
      const products = await productModel
        .find({
          $or: [
            { name: { $regex: key, $options: "i" } },
            { brand: { $regex: key, $options: "i" } },
          ],
        })
        .populate("category");
      if (!products) {
        return res.status(400).json({ val: false, msg: "No products found" });
      }
      res.status(200).json({ val: true, products });
    } catch (err) {
      console.log(err);
      res.status(500).json({ val: false, msg: "Something went wrong" });
    }
  },
  async searchOrders(req, res) {
    const { key } = req.query;
    try {
      const orders = await orderModel.find({
        $or: [
          { "user.username": { $regex: key, $options: "i" } },
          { orderStatus: { $regex: key, $options: "i" } },
          { paymentMethod: { $regex: key, $options: "i" } },
        ],
      });
      if (!orders) {
        return res.status(400).json({ val: false, msg: "No orders found" });
      }
      res.status(200).json({ val: true, orders });
    } catch (err) {
      console.log(err);
      res.status(500).json({ val: false, msg: "Something went wrong" });
    }
  },
  async searchCategories(req, res) {
    const { key } = req.query;
    try {
      const categories = await categoryModel.find({
        name: { $regex: key, $options: "i" },
      });
      if (!categories) {
        return res.status(400).json({ val: false, msg: "No categories found" });
      }
      res.status(200).json({ val: true, categories });
    } catch (err) {
      console.log(err);
      res.status(500).json({ val: false, msg: "Something went wrong" });
    }
  },
  async searchCoupons(req, res) {
    const { key } = req.query;
    try {
      const coupons = await couponModel.find({
        code: { $regex: key, $options: "i" },
      });
      if (!coupons) {
        return res.status(400).json({ val: false, msg: "No coupons found" });
      }
      res.status(200).json({ val: true, coupons });
    } catch (err) {
      console.log(err);
      res.status(500).json({ val: false, msg: "Something went wrong" });
    }
  },
};
