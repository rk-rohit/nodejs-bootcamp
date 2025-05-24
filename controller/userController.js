const UserModel = require("../schema/UserSchema");
const bcrypt = require("bcryptjs");

module.exports.getAllUser = async (req, res) => {
  try {
    const respone = await UserModel.find().select("-password");
    res.status(200).json({
      status: "sucess",
      reqBy: req.user,
      data: {
        users: respone,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const responce = await UserModel.findById(req.param.id);
    res.status(200).json({
      status: "success",
      data: responce
    })

  } catch(err) {
    res.status(400).json({
      status: "failed",
      message: err.message
    })
  }
};


module.exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: "failed",
        message: "User with this email already exist!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user = new UserModel({
      name,
      email,
      password: hashPassword,
    });

    const respone = await user.save();
    return res.status(200).json({
      status: "success",
      data: respone,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

module.exports.updateUser = () => {};

module.exports.deleteUserById = () => {};
