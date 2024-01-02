const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProduct,
  getAllProducts,
} = require("../controllers/productController");

router.post("/", createProduct);
router.get("/:id", getProduct);
router.get("/", getAllProducts);

module.exports = router;
