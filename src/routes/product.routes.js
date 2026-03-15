const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getByProductId);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  productController.createProduct
);
router.post(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  productController.updateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  productController.deleteProduct
);

module.exports = router;
