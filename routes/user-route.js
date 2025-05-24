const express = require("express");
const { getAllUser, getUserById, createUser, updateUser, deleteUserById } = require("../controller/userController");

const userRouter = express.Router();

userRouter.get("/", getAllUser);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;