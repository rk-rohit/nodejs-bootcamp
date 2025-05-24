const express = require('express');
const app = express();

const productRouter = require("./routes/product-route");
const userRouter = require('./routes/user-route');
const { authenticate, loginUser, logoutUser } = require('./controller/loginController');

// middleware
app.use(express.json())
app.use((req, res, next)=>{
    req.requestedAt = new Date().toISOString();
    next();
})

//route
app.use("/api/v1/product", productRouter);
app.use("/api/v1/user", authenticate, userRouter);
app.post("/api/v1/login", loginUser);
app.delete("/api/v1/logout", authenticate, logoutUser);

module.exports = app;