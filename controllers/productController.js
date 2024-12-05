const productModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const categoryModel = require("../models/categoryModel");
const orderModel = require("../models/orderModel");
const wishlistModel = require("../models/wishlistModel");
const path = require("path");

module.exports = {
  async homeLoad(req, res) {
    try {
      const products = await productModel.find({isDeleted:false}); 

      const category = await categoryModel.find(); 
      const topSellingProducts = await orderModel.aggregate([
        { $match: { orderStatus: "delivered" } },
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
      const hotReleases = products.slice(0, 5);
      const dealsAndOutfits = products.slice(5, 10);

      console.log(hotReleases)

      res.render("index", {
        products: products,
        category: category,
        hotReleases:hotReleases,
        dealsAndOutfits:dealsAndOutfits,
        topSellingProducts: topSellingProducts,
      });
    } catch (err) {
      console.log(err);
    }
  },
  async shopLoad(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      let query = { isDeleted: false };
      let sortBy = {};

      if (req.query.sortBy === "Popularity") {
        sortBy.popularity = -1;
      } else if (req.query.sortBy === "Average rating") {
        sortBy.rating = -1;
      } else if (req.query.sortBy === "Newness") {
        sortBy.createdAt = -1;
      } else if (req.query.sortBy === "Price: Low to High") {
        sortBy.price = 1;
      } else if (req.query.sortBy === "Price: High to Low") {
        sortBy.price = -1;
      } else {
        sortBy.createdAt = -1;
      }

      if (req.query.price && req.query.price !== "") {
        const priceRange = req.query.price.split(" - ");
        const minPrice = parseInt(priceRange[0].replace("₹", "").trim(), 10);
        const maxPrice = priceRange[1]
          ? parseInt(priceRange[1].replace("₹", "").trim(), 10)
          : Infinity;
        query.price = { $gte: minPrice, $lte: maxPrice };
      }

      // Fetch only active categories
      const activeCategories = await categoryModel.find({ isDeleted: false });
      const activeCategoryIds = activeCategories.map((cat) =>
        cat._id.toString()
      );

      // Filter by category if specified in the query
      if (req.query.category && req.query.category !== "") {
        const category = activeCategories.find(
          (cat) => cat.name === req.query.category
        );
        if (category) {
          query.category = category._id;
        } else {
          query.category = null; // No matching category found
        }
      } else {
        query.category = { $in: activeCategoryIds }; // Only include active categories
      }

      // Fetch products with the refined query
      let products = await productModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort(sortBy);

      // Alphabetical sorting if specified
      if (req.query.name === "A-Z") {
        products = products.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }

      // Send active categories and filtered products
      if (req.query.api) {
        return res.status(200).json({ products, category: activeCategories });
      } else {
        res
          .status(200)
          .render("shop", { products, category: activeCategories });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading shop data");
    }
  },
  async productDetailesLoad(req, res) {
    const productId = req.params.id;
    try {
      const product = await productModel.findOne({ _id: productId });
      const category = await categoryModel.findOne({ _id: product.category });
      const isAlreadyWishlist = await wishlistModel.findOne({
        userId: req.session.currentId,
        "items.productId": productId,
      });
      const relatedProducts = await productModel
        .find({ category: product.category, brand: product.brand })
        .limit(4);
      const isBuyedUser = await orderModel.findOne({
        "items.product": product._id,
        user: req.session.currentId,
        orderStatus: "delivered",
      });
      console.log(product);
      res.status(200).render("details", {
        product,
        relatedProducts,
        category,
        isBuyedUser: !!isBuyedUser,
        isAlreadyWishlist,
      });
    } catch (err) {
      res.status(500).send("Server side error");
    }
  },
  async productsPageLoad(req, res) {
    const { page = 1 } = req.query;
    const limit = 7;
    const skip = (page - 1) * limit;

    try {
      const products = await productModel
        .find({})
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      const totalProducts = await productModel.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
      const category = await categoryModel.find({});

      return res.status(200).render("productsManagment", {
        val: products.length > 0,
        msg: products.length ? null : "No products found",
        products,
        category,
        currentPage: Number(page),
        totalPages,
        pagesToShow: 3,
      });
    } catch (err) {
      console.log(err);
      res.status(500).render("productsManagment", {
        val: false,
        msg: "Error loading products",
        products: null,
        category: null,
      });
    }
  },
  async productsAdd(req, res) {
    try {
      let {
        name,
        description,
        category,
        tags,
        brand,
        price,
        colors,
        sizes,
        cashOnDelivery,
        offerPrice,
        warranty,
        returnPolicy,
      } = req.body;

      price = Number(price);
      offerPrice = Number(offerPrice) || 0;
      cashOnDelivery = cashOnDelivery === "true";

      sizes = JSON.parse(sizes);
      const parsedSizes = {};
      for (let size in sizes) {
        const { stock, maxQuantity } = sizes[size];
        const parsedStock = Number(stock);
        const parsedMaxQuantity = Number(maxQuantity);

        if (isNaN(parsedStock) || parsedStock <= 0) {
          return res
            .status(400)
            .json({ val: false, msg: `Invalid stock value for size ${size}` });
        }
        if (isNaN(parsedMaxQuantity) || parsedMaxQuantity <= 0) {
          return res.status(400).json({
            val: false,
            msg: `Invalid max quantity value for size ${size}`,
          });
        }
        if (parsedMaxQuantity > parsedStock) {
          return res.status(400).json({
            val: false,
            msg: `Max quantity (${parsedMaxQuantity}) cannot exceed stock (${parsedStock}) for size ${size}`,
          });
        }

        parsedSizes[size] = {
          stock: parsedStock,
          maxQuantity: parsedMaxQuantity,
        };
      }
      colors = colors
        ? colors
            .split(",")
            .map((color) => color.trim())
            .filter(Boolean)
        : [];
      tags = tags
        ? tags
            .split("#")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];
      const categoryObject = await CategoryModel.findOne({ name: category });
      if (!categoryObject) {
        return res.status(400).json({ val: false, msg: "Category not found" });
      }
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ val: false, msg: "No files were uploaded" });
      }

      const imagePaths = [];
      for (const key in req.files) {
        req.files[key].forEach((file) => {
          imagePaths.push(
            path.relative(path.join(__dirname, "..", "public"), file.path)
          );
        });
      }

      await productModel.create({
        name,
        description,
        price,
        offerPrice,
        category: categoryObject._id,
        images: imagePaths,
        colors,
        sizes: parsedSizes,
        brand,
        tags,
        cashOnDelivery,
        warranty,
        returnPolicy,
      });

      res.status(200).json({ val: true, msg: "Product added successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ val: false, msg: "Internal server error" });
    }
  },
  async productUpdateLoad(req, res) {
    const { productId } = req.params;
    console.log(productId);
    try {
      const product = await productModel.findOne({ _id: productId });
      const category = await categoryModel.find({});
      res.status(200).render("updateProducts", { product, category });
    } catch (err) {
      res
        .status(200)
        .json({ product: null, category: null, msg: "Cant find product" });
      console.log(err);
    }
  },
  async productUnlist(req, res) {
    const { id, val } = req.query;
    try {
      if (val === "Unlist") {
        await productModel.updateOne({ _id: id }, { isDeleted: true });
      } else {
        await productModel.updateOne({ _id: id }, { isDeleted: false });
      }
      res.status(200).json({ val: true });
    } catch (err) {
      res.status(500).json({ val: false });
    }
  },
  async productStock(req, res) {
    const { id, size } = req.query;
    try {
      const product = await productModel.findOne({ _id: id });
      console.log(product);
      let s = "";
      for (let x in product.sizes) {
        if (x === size) {
          s = product.sizes[x];
        }
      }
      console.log(s);
      console.log(id, size);
      res.status(200).json({ val: true, stock: s });
    } catch (err) {
      res.status(200).json({ val: false, stock: null });
      console.log(err);
    }
  },
  async productImageUpdate(req, res) {
    try {
      const { productIndex } = req.body;
      const { productId } = req.params;
      if (!req.file) {
        return res
          .status(400)
          .json({ val: false, msg: "No file was uploaded" });
      }
      const filePath = path.relative(
        path.join(__dirname, "..", "public"),
        req.file.path
      );
      console.log("Product Index:", productIndex);
      console.log("Product ID:", productId);
      console.log("File Path:", filePath);
      const product = await productModel.findOne({ _id: productId });
      if (!product) {
        return res.status(404).json({ val: false, msg: "Product not found" });
      }
      product.images[productIndex] = filePath;
      await product.save();
      return res
        .status(200)
        .json({ val: true, msg: "Product image updated successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ val: false, msg: "Server error" });
    }
  },
  async productColorRemove(req, res) {
    try {
      const { productId, index } = req.params;
      console.log(index);
      console.log(productId);
      const product = await productModel.findOne({ _id: productId });
      if (!product) {
        return res.status(404).json({ val: false, msg: "Product not found" });
      }
      product.colors.splice(index, 1);
      await product.save();
      return res
        .status(200)
        .json({ val: true, msg: "Color removed successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ val: false, msg: "Server error" });
    }
  },
  async productColorAddUpdate(req, res) {
    try {
      const productId = req.query.productId;
      const color = req.query.color;
      console.log(color);
      console.log(productId);
      const product = await productModel.findOne({ _id: productId });
      if (!product) {
        return res.status(404).json({ val: false, msg: "Product not found" });
      }
      product.colors.push(color);
      await product.save();
      return res
        .status(200)
        .json({ val: true, msg: "Color added successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ val: false, msg: "Server error" });
    }
  },
  async productDataUpdate(req, res) {
    let {
      name,
      description,
      category,
      tags,
      brand,
      price,
      cod,
      offPrice,
      warranty,
      returnPolicy,
    } = req.body;
    const { productId } = req.params;
    try {
      price = Number(price);
      offPrice = Number(offPrice);
      cod = cod == null ? false : true;
      console.log(offPrice);
      offPrice = offPrice ? offPrice : 0;
      tags = tags.split("#").filter((tag) => tag.trim() !== "");
      const cat = await categoryModel.findOne({ name: category });
      const product = await productModel.findOne({ _id: productId });
      if (!product) {
        return res.status(404).json({ val: false, msg: "Product not found" });
      }
      await product.updateOne({
        name: name,
        description: description,
        category: cat._id,
        tags: tags,
        brand: brand,
        price: price,
        cashOnDelivery: cod,
        offerPrice: offPrice,
        warranty: warranty,
        returnPolicy: returnPolicy,
      });
      return res
        .status(200)
        .json({ val: true, msg: "Product updated successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ val: false, msg: "Server error" });
    }
  },
  async productStockUpdate(req, res) {
    let { size, stock } = req.body;
    const { productId } = req.params;
    try {
      const product = await productModel.findOne({ _id: productId });

      if (!product) {
        return res.status(404).json({ val: false, msg: "Product not found" });
      }

      if (!product.sizes[size]) {
        return res
          .status(400)
          .json({ val: false, msg: `Size ${size} not found in product` });
      }

      product.sizes[size].stock += stock;
      product.markModified("sizes");
      await product.save();

      return res
        .status(200)
        .json({ val: true, msg: "Product stock updated successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ val: false, msg: "Server error" });
    }
  },
  async categoryUpdateLoad(req, res) {
    const { categoryId } = req.params;
    console.log(categoryId);
    try {
      const category = await categoryModel.find({});
      res.status(200).render("updateCategory", { category });
    } catch (err) {
      res.status(200).json({ category: null, msg: "Cant find product" });
      console.log(err);
    }
  },
  async productsearch(req, res) {
    const { key } = req.query;
    console.log(key);
    try {
      const results = await productModel
        .find({
          $or: [
            { name: { $regex: key, $options: "i" } },
            { tags: { $regex: key, $options: "i" } },
            { brand: { $regex: key, $options: "i" } },
          ],
          isDeleted: false,
        })
        .limit(10);
      if (!results) {
        return res.status(200).json({ val: false, msg: "No items found" });
      }
      res.status(200).json({ val: true, results });
    } catch (err) {
      console.log(err);
      res.status(200).json({ val: false, msg: "Server error" + err });
    }
  },
  async productReviewsLoad(req, res) {
    const { productId } = req.params;
    try {
      const product = await productModel.findOne({ _id: productId });
      if (!product) {
        return res.status(400).json({ val: false, msg: "No reviews found" });
      }
      res.status(200).json({
        val: true,
        reviews: product.reviews,
        currentUserId: req.session.currentId,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ val: false, msg: "An error occurred while fetching reviews" });
    }
  },
  async productReviewsAdd(req, res) {
    const { productId } = req.params;
    const { comment, rating } = req.body;
    try {
      console.log(comment, rating);
      if (!productId) {
        return res
          .status(400)
          .json({ val: false, msg: "Product id not valid" });
      }
      await productModel.findByIdAndUpdate(
        productId,
        {
          $push: {
            reviews: {
              user: req.session.currentId,
              username: req.session.currentUsername,
              comment,
              rating,
            },
          },
        },
        { new: true }
      );
      res.status(200).json({ val: true });
    } catch (err) {
      console.log(err);
      res.status(500), json({ val: false, msg: err });
    }
  },
  async productReviewsDelete(req, res) {
    const { reviewId } = req.params;

    try {
      if (!req.session.currentId) {
        return res.status(400).json({ val: false, msg: "Please login first" });
      }
      if (!reviewId) {
        return res
          .status(400)
          .json({ val: false, msg: "Review ID not provided or invalid" });
      }
      const result = await productModel.updateOne(
        { "reviews._id": reviewId, "reviews.user": req.session.currentId },
        { $pull: { reviews: { _id: reviewId } } }
      );

      if (result.modifiedCount === 0) {
        return res
          .status(404)
          .json({ val: false, msg: "Review not found or user not authorized" });
      }

      res.status(200).json({ val: true, msg: "Review deleted successfully" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({
          val: false,
          msg: "An error occurred while deleting the review",
        });
    }
  },
};
