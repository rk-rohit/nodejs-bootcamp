const ProductModel = require("../schema/ProductSchema");
const product = require("../data/product.json");

module.exports.getAllProduct = async (req, res) => {
  try {
    let query = ProductModel.find();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip =  (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.field) {
      query = query.select(req.query.field.split(",").join(" "));
    }
    const [products, totalRecords] = await Promise.all([
      query,
      ProductModel.countDocuments()
    ]);

    res.status(200).json({
      status: "success",
      requestAt: req.requestAt,
      data: {
        products: products,
        pageSize: products.length,
        totalRecords,
        totalPages:  Math.ceil(totalRecords/limit),
        currentPage: page
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      requestAt: req.requestAt,
      message: err.message,
    });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const productDetails = await ProductModel.findById(req.params.id);
    if (!productDetails) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json({
      status: "success",
      requestedAt: req.requestedAt,
      data: productDetails,
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      requestedAt: req.requestedAt,
      message: err.message,
    });
  }
};

module.exports.createProduct = (req, res) => {
  new ProductModel(req.body)
    .save()
    .then((data) => {
      return res.status(201).json({
        status: "successs",
        requestedAt: req.requestedAt,
        data,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        status: "failed",
        requestedAt: req.requestedAt,
        message: err.message,
      });
    });
};

module.exports.updateProduct = async (req, res) => {
  try {
    const updateProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true, // ✅ This runs schema validations
        new: true, // Optional: returns the updated document
      }
    );
    res.status(200).json({
      status: "success",
      requestedAt: req.requestedAt,
      data: updateProduct,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      requestedAt: req.requestedAt,
      message: err.message,
    });
  }
};

module.exports.seedDatabase = async (req, res)=> {
  try {
    await ProductModel.deleteMany(); // Optional: clear old data
    const result = await ProductModel.insertMany(product);
    console.log(`${result.length} products inserted.`);
    res.status(200).json({
      message: `successfully seed the product data! - ${result.length} products inserted.`,
    })
  } catch (err) {
    console.error("Insert error:", err);
    res.status(400).json({
      status: "failed",
      message: err.message,
    })
  }
}
