const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
const path = require("path");

module.exports = {
  async categoryLoadAdmin(req, res) {
    const { page = 1 } = req.query;
    const limit = 7;
    const skip = (page - 1) * limit;

    try {
      const totalCategories = await categoryModel.countDocuments();
      const totalPages = Math.ceil(totalCategories / limit);
      const categories = await categoryModel.aggregate([
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
        { $skip: skip },
        { $limit: limit },
      ]);
      console.log(categories);

      return res.status(200).render("categoryManagement", {
        category: categories,
        currentPage: Number(page),
        totalPages,
        pagesToShow: 3,
      });
    } catch (err) {
      console.log(err);
      res.status(500).render("categoryManagement", {
        category: null,
        msg: "Error loading categories",
      });
    }
  },
  async categoryAdd(req, res) {
    const { categoryName } = req.body;
    try {
      const imagePath = path.relative(
        path.join(__dirname, "..", "public"),
        req.file.path
      );
      console.log(imagePath);
      const category = await categoryModel.findOne({ name: categoryName });
      if (category) {
        return res.status(200).json({ val: false, msg: "Category already exists" });
      }
      await categoryModel.create({ name: categoryName, image: imagePath });
      res.status(200).json({ val: true, msg: "Category added successfully" });
    } catch (err) {
      console.log(err);
      res.status(200).json({ val: false, msg: "Category add failed" });
    }
  },
  async categoryLoad(req, res) {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
      const products = await productModel
        .find({ category: categoryId })
        .skip(skip)
        .limit(limit);
      const category = await categoryModel.findOne({ _id: categoryId });
      if (req.query.api === "true") {
        return res.status(200).json({ products, category });
      } else {
        return res.status(200).render("category", { products, category });
      }
    } catch (err) {
      res.status(500).render("category", { products: null, category: null });
    }
  },
  async categoryUnlist(req, res) {
    const { id, val } = req.query;
    console.log(id);
    console.log(val);
    try {
      if (val === "Unlist") {
        await categoryModel.updateOne({ _id: id }, { isDeleted: true });
      } else {
        await categoryModel.updateOne({ _id: id }, { isDeleted: false });
      }
      res.status(200).json({ val: true });
    } catch (err) {
      res.status(500).json({ val: false });
    }
  },
  async categoryUpdateload(req, res) {
    const { categoryId } = req.params;
    const category = await categoryModel.findOne({ _id: categoryId });
    res.render("updateCategory", { category });
  },
  async categoryImageUpdate(req, res) {
    try {
      const { categoryId } = req.params;
      if (!req.file) {
        return res
          .status(400)
          .json({ val: false, msg: "No file was uploaded" });
      }
      const filePath = path.relative(
        path.join(__dirname, "..", "public"),
        req.file.path
      );
      console.log("Category ID:", categoryId);
      console.log("File Path:", filePath);
      const category = await categoryModel.findOne({ _id: categoryId });
      if (!category) {
        return res.status(404).json({ val: false, msg: "Category not found" });
      }
      category.image = filePath;
      await category.save();
      return res
        .status(200)
        .json({ val: true, msg: "Category image updated successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ val: false, msg: "Server error" });
    }
  },
async categoryUpdate(req, res) {
  const { categoryId } = req.params;
  const { categoryName } = req.body;

  try {
    const category = await categoryModel.findOne({ _id: categoryId });
    if (!category) {
      return res.status(404).json({ val: false, msg: "Category not found" });
    }
    category.name = categoryName;
    await category.save();
    return res.status(200).json({ val: true, msg: "Category updated successfully" });
  } catch (err) {
    console.error("Error during category update:", err);
    return res.status(500).json({ val: false, msg: "Server error" });
  }
}
,
};
