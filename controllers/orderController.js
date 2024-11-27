const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const razorpay = require("../services/paymentServiece");
const walletModel = require("../models/walletModel");
const crypto = require("crypto");
const couponModel = require("../models/couponModel");
const notificationModel = require("../models/notificationModel");

module.exports = {
  async placeOrder(req, res) {
    const { item, selectedAddressId, selectedPayment, isOfferApplied, code } =
      req.body;
    const userId = req.session.currentId;
    try {

      console.log(isOfferApplied);

      if (!item || !selectedAddressId || !selectedPayment) {
        return res
          .status(400)
          .json({ val: false, msg: "Missing required fields" });
      }
      let parsedItem;
      try {
        parsedItem = JSON.parse(item);
      } catch (err) {
        return res.status(400).json({ val: false, msg: "Invalid item format" });
      }

      console.log(`parsed item :----------- ${parsedItem}`);

      const isArray = Array.isArray(parsedItem);
      let items, totalAmount;

      const validateItem = (product) => {
        if (
          !product._id ||
          typeof product.quantity !== "number" ||
          typeof product.offerPrice !== "number" ||
          !product.size ||
          !product.color
        ) {
          console.log(product._id);
          console.log(typeof product.quantity !== "number");
          console.log(typeof product.offerPrice !== "number");
          console.log(product.size);
          console.log(product.color);
          return res
            .status(400)
            .json({ val: false, msg: "Invalid product data" });
        }
      };

      if (isArray) {
        parsedItem.forEach(validateItem);
        items = parsedItem.map((product) => ({
          product: new mongoose.Types.ObjectId(product._id),
          quantity: product.quantity,
          offerPrice: product.offerPrice,
          size: product.size,
          color: product.color,
        }));
        totalAmount = items.reduce(
          (sum, item) => sum + Number(item.offerPrice) * Number(item.quantity),
          0
        );
        await cartModel.deleteMany({ userId });
      } else {
        validateItem(parsedItem);
        items = {
          product: new mongoose.Types.ObjectId(parsedItem._id),
          quantity: parsedItem.quantity,
          offerPrice: parsedItem.offerPrice,
          size: parsedItem.size,
          color: parsedItem.color,
        };
        totalAmount = Number(items.offerPrice) * Number(items.quantity);
        await cartModel.deleteOne({
          userId,
          "items.product": parsedItem._id,
        });
      }

      const user = await userModel.findOne({ _id: userId });
      const address = user.address.find(
        (addr) => addr._id.toString() === selectedAddressId
      );
      if (!address) {
        return res.status(400).json({ val: false, msg: "Invalid address ID" });
      }

      let discountedPrice = totalAmount;

      console.log(isOfferApplied, code);
      console.log(totalAmount);
      if (isOfferApplied) {
        const coupon = await couponModel.findOne({});
        console.log("Its offer Applied");
        if (coupon.discountType === "percentage") {
          const discountPercentage = parseFloat(coupon.discountValue);
          let discountAmount = (totalAmount * discountPercentage) / 100;
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          }
          discountedPrice = totalAmount - discountAmount;
        } else if (coupon.discountType === "flat") {
          const flatDiscount = parseFloat(coupon.discountValue);
          discountedPrice = totalAmount - flatDiscount;
        }
        discountedPrice = Math.max(discountedPrice, 0);
      } else {
        console.log("not offer Applied");
      }

      console.log(discountedPrice);

      const amountToSend = discountedPrice || totalAmount;

      if (selectedPayment === "cash_on_delivery") {
        if(amountToSend>1000){
          return res.status(400).json({val: false,msg: "COD only available for product less then 1000",});
        }
        const order = await orderModel.create({
          user: userId,
          items: isArray ? items : [items],
          totalAmount: amountToSend,
          paymentMethod: selectedPayment,
          shippingAddress: address,
          orderedAt: new Date(),
          paymentStatus: "pending",
          orderStatus: "processing",
          statusHistory: [{ status: "processing", updatedAt: new Date() }],
        });
        for (let i = 0; i < (isArray ? items : [items]).length; i++) {
          const {
            product: productId,
            size,
            quantity: quantityOrdered,
          } = isArray ? items[i] : items;
          const product = await productModel.findById(productId);

          if (!product || !product.sizes[size]) {
            return res
              .status(404)
              .json({ val: false, msg: "Product or size not found" });
          }

          if (product.sizes[size].stock >= quantityOrdered) {
            product.sizes[size].stock -= quantityOrdered;
            product.markModified("sizes");
            await product.save();
          } else {
            return res.status(400).json({
              val: false,
              msg: `Not enough stock for size ${size}`,
            });
          }
        }

        return res.status(200).json({
          val: true,
          msg: "Order placed successfully with Cash on Delivery",
        });
      } else if (selectedPayment === "razorpay") {
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(discountedPrice * 100),
          currency: "INR",
          receipt: `order_rcptid_${Math.random()
            .toString(36)
            .substring(2, 15)}`,
          notes: {
            userId,
            addressId: selectedAddressId,
          },
        });
        const order = await orderModel.create({
          user: userId,
          items: items,
          totalAmount: amountToSend,
          paymentMethod: selectedPayment,
          shippingAddress: address,
          razorpayOrderId: razorpayOrder.id,
          orderedAt: new Date(),
          paymentStatus: "pending",
          orderStatus: "processing",
          statusHistory: [{ status: "processing", updatedAt: new Date() }],
        });
        console.log(razorpayOrder);
        return res.status(200).json({
          val: true,
          msg: "Razorpay order created successfully",
          order: razorpayOrder,
          key: "rzp_test_P7m0ieN3xeK18I",
        });
      } else if (selectedPayment === "wallet") {
        let wallet = await walletModel.findOne({
          userId: req.session.currentId,
        });
        if (!wallet) {
          return res.status(404).json({ val: false, msg: "Wallet not found" });
        }
        console.log(wallet.balance);
        console.log(amountToSend);
        if (wallet.balance < amountToSend) {
          return res
            .status(404)
            .json({ val: false, msg: "Not enough money in wallet" });
        }

        wallet.balance -= discountedPrice ? discountedPrice : totalAmount;
        wallet.transactionHistory.push({
          transactionType: "purchase",
          transactionAmount: discountedPrice ? discountedPrice : totalAmount,
          transactionDate: new Date(),
          description: `Purchase of the order ${item.orderId}`,
        })
        console.log(wallet);
        await wallet.save();
        const order = await orderModel.create({
          user: userId,
          items: isArray ? items : [items],
          totalAmount: amountToSend,
          paymentMethod: selectedPayment,
          shippingAddress: address,
          orderedAt: new Date(),
          paymentStatus: "pending",
          orderStatus: "processing",
          statusHistory: [{ status: "processing", updatedAt: new Date() }],
        });
        for (let i = 0; i < (isArray ? items : [items]).length; i++) {
          const {
            product: productId,
            size,
            quantity: quantityOrdered,
          } = isArray ? items[i] : items;
          const product = await productModel.findById(productId);

          if (!product || !product.sizes[size]) {
            return res
              .status(404)
              .json({ val: false, msg: "Product or size not found" });
          }

          if (product.sizes[size].stock >= quantityOrdered) {
            product.sizes[size].stock -= quantityOrdered;
            product.markModified("sizes");
            await product.save();
          } else {
            return res.status(400).json({
              val: false,
              msg: `Not enough stock for size ${size}`,
            });
          }
        }

        return res.status(200).json({
          val: true,
          order,
          msg: "Order placed successfully with wallet",
        });
      } else {
        return res
          .status(400)
          .json({ val: false, msg: "Invalid payment method" });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ val: false, msg: "Server error", error: err.message });
    }
  },
  async cancelOrder(req, res) {
    const { orderId } = req.params;
    const { currentId } = req.session;
    console.log(orderId);
    console.log(currentId);

    try {
      const order = await orderModel.findOne({ _id: orderId });
      if (!order) {
        return res.status(404).json({ val: false, msg: "Order not found" });
      }
      if (order.paymentMethod === "razorpay"||order.paymentMethod === "wallet") {
        let wallet = await walletModel.findOne({
          userId: currentId,
        });
        if (!wallet) {
          wallet = await walletModel.create({
            userId: req.session.currentId,
            balance: order.totalAmount,
            transactionHistory: [
              {
                transactionType: "refund",
                transactionAmount: order.totalAmount,
                transactionDate: new Date(),
                description: `Refund for canceled order ${orderId}`,
              },
            ],
          });
        } else {
          wallet.balance += order.totalAmount;
          wallet.transactionHistory.push({
            transactionType: "refund",
            transactionAmount: order.totalAmount,
            transactionDate: new Date(),
            description: `Refund for canceled order ${orderId}`,
          });
          await wallet.save();
        }
      }
      order.orderStatus = "cancelled";
      order.statusHistory.push({
        status: "cancelled",
        updatedAt: new Date(),
      });
      await order.save();

      res.status(200).json({ val: true, msg: "Order cancellation completed" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ val: false, msg: "Order cancellation failed" });
    }
  },
  async viewOrderDetails(req, res) {
    const { orderId } = req.params;
    console.log(orderId);
    try {
      const order = await orderModel.findOne({ _id: orderId }).populate({
        path: "items.product",
        select: "name description price category imageUrl",
      });
      console.log(order);
      if (!order) {
        return res.status(404).json({
          val: false,
          shippingAddress: null,
          items: null,
          msg: "Order not found",
        });
      }
      console.log(order);
      res.status(200).json({
        val: true,
        shippingAddress: order.shippingAddress,
        items: order.items,
        msg: null,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        val: false,
        shippingAddress: null,
        items: null,
        msg: "Order Cancelation failed",
      });
    }
  },
  async adminOrdersLoad(req, res) {
    try {
      const currentPage = parseInt(req.query.page) || 1;
      const ordersPerPage = 10;
      const totalOrders = await orderModel.countDocuments();
      const totalPages = Math.ceil(totalOrders / ordersPerPage);
      const orders = await orderModel
        .find({})
        .populate("user")
        .populate({
          path: "items.product",
          model: "Products",
        })
        .skip((currentPage - 1) * ordersPerPage)
        .limit(ordersPerPage);
  
      res.status(200).render("ordersManagment", {
        order:orders,      
        currentPage,    
        totalPages,    
        pagesToShow: 5, 
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
  ,
  async adminOrdersViewLoad(req, res) {
    const { orderId } = req.params;
    console.log(orderId);
    try {
      const order = await orderModel.findOne({ _id: orderId }).populate({
        path: "items.product",
        select: "name description price category imageUrl",
      });
      console.log(order);
      res.status(404).render("orderView", { order });
    } catch (err) {
      console.log(err);
    }
  },
  async adminOrdersStatusUpdate(req, res) {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    try {
      if (
        !["processing", "shipped", "delivered", "cancelled"].includes(newStatus)
      ) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const order = await orderModel.findOne({ _id: orderId });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      order.orderStatus = newStatus;
      order.statusHistory.push({ status: newStatus, updatedAt: new Date() });
      await order.save();
      return res.json({
        val: true,
        status: newStatus,
        updatedAt:
          order.statusHistory[order.statusHistory.length - 1].updatedAt,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async verifyPayment(req, res) {
    console.log('suiii')
    const { paymentId, orderId, signature } = req.body;
    const userId = req.session.currentId;
    console.log(paymentId, orderId, signature);
    try {
      if (!paymentId || !orderId || !signature) {
        return res.status(400).json({ val: false, msg: "Missing required fields" });
      }
      const body = orderId + "|" + paymentId;
      const expectedSignature = crypto
        .createHmac("sha256", "4Tme4oGDBm9a7Uh8xLiOmfyd")
        .update(body)
        .digest("hex");

      if (expectedSignature !== signature) {
        return res.status(400).json({ val: false, msg: "Invalid payment signature" });
      }

      const payment = await razorpay.payments.fetch(paymentId);

      if (payment.status !== "captured") {
        // await updateOrderStatus(orderId, "failed"); 
        return res.status(400).json({ val: false, msg: "Payment not captured" });
      }

      res.status(200).json({
        val: true,
        msg: "Payment verified and order placed successfully",
        orderId,
      });
    } catch (err) {
      console.error("Error verifying payment:", err);
      res.status(500).json({
        val: false,
        msg: "Payment verification failed",
        error: err.message,
      });
    }
  },
  async successPageLoad(req,res){
    try{
      res.render('success')
    }catch(err){
      console.log(err)
    }
  },
  async reqestReturn(req,res){
    const {orderId} = req.params;
    const {reasonMsg} = req.body;
    console.log(reasonMsg);
    try{
      const updateResult = await orderModel.updateOne(
        { _id: orderId },
        {
          $set: {
            'returnRequest.requestStatus': true,
            'returnRequest.requestMessage': reasonMsg,
          },
        }
      );  
      res.status(200).json({val:true});
    }catch(err){
      console.log(err);
      res.status(500).json({val:false,msg:'Something went wrong'});
    }
  }
};
