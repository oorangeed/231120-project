require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const port = 3004; //npm run dev

mongoose.connect("mongodb://127.0.0.1/shopping-demo2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
app.use(express.json());

const router = express.Router();
app.use("/api", express.urlencoded({ extended: false }), router);
// app.use(express.static("assets"));

//회원가입 , 로그인 라우터
const authRouter = require("./routes/auth.router.js");
app.use("/api/auth", authRouter);

// 상품 라우터
const productRouter = require("./routes/products.router.js");
app.use("/api/products", productRouter);
// const router = require("./routes/products.router")
// app.use("/api", router);

// 서버 확인
app.listen(port, () => {
    console.log(port, "포트로 서버가 열렸어요!")
});

