const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getByProductId);
// router.post(
//   "/",
//   authMiddleware,
//   upload.single("image"),
//   productController.createProduct
// );
router.post("/upload", upload.array("images", 5));
router.post("/", upload.any(), productController.createProduct);
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
