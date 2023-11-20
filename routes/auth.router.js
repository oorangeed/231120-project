const express = require("express");

const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");

// 해시함수 라이브러리 npm i bcrypt 
const bcrypt = require("bcrypt");

// 이메일 형식 검증
function checkEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};

// 비밀번호 형식 검증
function checkPassword(password) {
    const passwordRegex = /^.{6,}$/;
    return passwordRegex.test(password);
};

// 경로 /api/auth
router.post("/signup", async (req, res) => {
    const { email, nickname, password, confirmPassword } = req.body;

    //이메일 형식 검증
    if (!checkEmail(email)) {
        res.status(400).send({
            errorMessage: "올바른 이메일 형식이 아닙니다. 다시 확인해주세요."
        });
        return;
    }
    // 비밀번호 6자 이상 검증
    if (!checkPassword(password)) {
        res.status(400).send({
            errorMessage: "비밀번호는 최소 6자 이상이어야합니다."
        });
        return;
    }

    // 비밀번호 검증
    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage: "Password가 다릅니다. 다시 확인해주세요.",
        });
        return;
    }

    // 이메일 중복여부 확인
    const existsUsers = await User.findOne({ email });
    if (existsUsers) {
        res.status(400).send({
            errorMessage: "해당 이메일은 이미 사용중입니다.",
        });
        return;
    }

    // 비밀번호 암호화(해싱), 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, nickname, password: hashedPassword });
    await user.save();


    res.status(201).send({
        message: "회원가입을 축하드립니다!"
    });
});


// 로그인 성공 시 JWT AccessToken 생성 반환 (유효기한 :12시간)
// 경로 /api/auth
router.post("/", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // 해시값 비교
    if (!user || !(bcrypt.compare(password, user.password))) {
        res.status(400).send({
            errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
        });
        return;
    }

    //토큰 반환 jwt.sign(payload, secretKey, options, callback)
    res.send({
        token: jwt.sign(
            { userId: user.userId },
            "custom-secret-key",
            { expiresIn: "12h" }
        )
    });
});

module.exports = router;

