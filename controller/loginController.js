const UserModel = require("../schema/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// In-memory blacklist (use Redis/DB in production)
const blacklistedTokens = new Set();

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid Credential",
      });
    }

    const response = await UserModel.findOne({
      email,
    });

    if (!response) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid Credential",
      });
    }

    const isMatch = await bcrypt.compare(password, response.password);

    if (!isMatch) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid Credential",
      });
    }

    const jsontoken = jwt.sign(
      {
        id: response._id,
        name: response.name,
        email: response.email,
      },
      process.env.JSON_WEB_TOKEN,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      status: "success",
      token: jsontoken,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: "Invalid Credential",
    });
  }
};

module.exports.authenticate = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Missing Token...!",
    });
  }

  if (blacklistedTokens.has(token))
    return res
      .status(403)
      .json({ status: "failed", message: "Token blacklisted" });

  jwt.verify(token, process.env.JSON_WEB_TOKEN, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    req.token = token;
    next();
  });
};

module.exports.logoutUser = (req, res) => {
  blacklistedTokens.add(req.token);
  res.status(200).json({
    status: "success",
    message: "Logout Successfully!",
  });
};
