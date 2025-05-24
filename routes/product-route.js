const {
  getAllProduct,
  getProductById,
  updateProduct,
  createProduct,
  seedDatabase
} = require("../controller/productController");

const express = require("express");
const router = express.Router();

// router.param("id", validateId)

router.get("/", getAllProduct);

router.get("/:id", getProductById);

router.post("/", createProduct);

router.patch("/:id", updateProduct);

router.post("/populate", seedDatabase);

module.exports = router;
