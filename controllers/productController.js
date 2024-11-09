const productModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const categoryModel = require("../models/categoryModel");
const path = require("path");

module.exports = {
  async homeLoad(req, res) {
    try {
      const category = await categoryModel.find({});
      const products = await productModel.find({}).sort({ _id: -1 }).limit(15);
      res.render("index", { category, products });
    } catch (err) {
      console.log(err);
    }
  },
  async shopLoad(req, res) {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const products = await productModel.find({}).skip(skip).limit(limit);
      const category = await categoryModel.find({});
      console.log(category)
      if (req.query.api) {
        return res.status(200).json({ products });
      } else {
        res.status(200).render("shop", { products, category });
      }
    } catch (err) {
      res.status(500).send("Error loading shop data");
    }
  },
  async productDetailesLoad(req, res) {
    const productId = req.params.id;
    try {
      const product = await productModel.findOne({ _id: productId });
      const category = await categoryModel.findOne({ _id: product.category });
      const relatedProducts = await productModel
        .find({ category: product.category, brand: product.brand })
        .limit(4);
      res.status(200).render("details", { product, relatedProducts, category });
    } catch (err) {
      res.status(500).send("Server side error");
    }
  },
  async productsPageLoad(req, res) {
    const { page = 1 } = req.query;
    const limit = 7;
    const skip = (page - 1) * limit;

    try {
      const products = await productModel.find({}).skip(skip).limit(limit);
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
    offerPrice = Number(offerPrice);
    cashOnDelivery = cashOnDelivery === "true";
    offerPrice = offerPrice === NaN ? 0 : offerPrice;
    console.log(sizes)
    sizes = JSON.parse(sizes);
    console.log(sizes)

    try {
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ val: false, msg: "No files were uploaded" });
      }
      const categoryObject = await CategoryModel.findOne({ name: category });
      if (!categoryObject) {
        return res.status(400).json({ val: false, msg: "Category not found" });
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
        offerPrice: offerPrice,
        category: categoryObject._id,
        images: imagePaths,
        colors: colors.split(",").filter(Boolean),
        sizes,
        brand,
        tags: tags.split("#").filter(Boolean),
        cashOnDelivery,
        warranty,
        returnPolicy,
      });
      res.status(200).json({ val: true, msg: "Upload successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ val: false, msg: "Internal server error" });
    }
  },
  async productUpdateLoad(req, res) {
    const { productId } = req.params;
    try {
      const data = await productModel.findOne({ _id: productId });
      res.status(200).json({ data, msg: null });
    } catch (err) {
      res.status(200).json({ data: null, msg: "Cant find product" });
      console.log(err);
    }
  },
  async productUnlist(req,res){
    const {id,val} = req.query;
    try{
        if(val==="Unlist"){
            await productModel.updateOne({_id:id},{isDeleted:true});
        }else{
            await productModel.updateOne({_id:id},{isDeleted:false});
        }
        res.status(200).json({val:true});
    }catch(err){
        res.status(500).json({val:false});
    }
 }
};
