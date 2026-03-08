const Product = require("../models/product.model");

exports.getAllProducts = async (query) => {
  const { page = 1, limit = 5, sort, category } = query;
  console.log(query);
  const filters = {};
  if (category) {
    const categoryFilter = category.split(",");
    filters.category = { $in: categoryFilter };
  }

  let productQuery = Product.find(filters);

  if (sort) {
    productQuery = productQuery.sort(sort);
  }

  const products = await productQuery;
  return products;
};

exports.getByProductId = async (id) => {
  return await Product.findById(id);
};

exports.createProduct = async (productData) => {
  return await Product.create(productData);
};

exports.updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

exports.deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};
