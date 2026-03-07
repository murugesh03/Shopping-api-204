const productService = require("../services/product.service");

exports.getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
};

exports.createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(204).end();
};
