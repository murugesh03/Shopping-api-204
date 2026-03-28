const productService = require("../services/product.service");
const mongoose = require("mongoose");
const s3Service = require("../services/s3.service");

exports.getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts(req.query);
  res.json(products);
};

exports.createProduct = async (req, res) => {
  console.log(req.body);
  try {
    const { description, title, id, folder } = req.body;
    // const imagePath = req.files ? req.files.map((file) => file.filename) : null;
    // console.log(imagePath, "imagePath");

    const imageUrls = await Promise.all(
      req.files.map((file) => s3Service.uploadToS3(file, folder))
    );

    console.log(imageUrls, "imageUrls");
    console.log(req.body, "req.body");
    const product = await productService.createProduct({
      id: Number(id),
      title,
      description,
      image: imageUrls // Assuming you want to use the first uploaded image URL
    });
    res.status(201).json({
      ...product,
      image: imageUrls // Use the first uploaded image URL
    });
  } catch (error) {
    console.log(error, "this is create product error");
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByProductId = async (req, res, next) => {
  try {
    console.log(req.params.id);

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("Invalid product ID");
      error.statusCode = 400;
      throw error;
    }

    const product = await productService.getByProductId(id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};
