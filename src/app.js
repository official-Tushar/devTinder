const dotenv = require("dotenv");
const express = require("express");
const {connectDB} = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// first establish the connection with the database and then only start the server
connectDB()
    .then(() => {
        console.log("Database Connection Established");
        app.listen(7777, () => {
            console.log("Server is successfully running on port 7777...");
        });
    })
    .catch((err) => {
        console.log("Database cannot be connected..");
    });