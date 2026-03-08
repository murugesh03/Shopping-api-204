const productService = require("../services/product.service");

exports.getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts(req.query);
  res.json(products);
};

exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
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

exports.getByProductId = async (req, res) => {
  console.log(req.params.id);
  const product = await productService.getByProductId(req.params.id);
  res.json(product);
};
