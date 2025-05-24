const server = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./db");

dotenv.config();
connectDB();

server.listen(process.env.PORT || 8000, ()=>{
    console.log(`server is listening at port ${process.env.PORT}`);
});
