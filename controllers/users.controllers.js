const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

const { validationResult } = require("express-validator");

const emailExist = "الايميل دا موجود .. اختار حاجة تانية";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Users = require("../models/users.model");

const addUser = async (req, res) => {
  const valid = validationResult(req);
  if (!valid.isEmpty()) {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      errros: valid.array(),
      msg: "خطأ فى التسجيل - راجع المعلومات جيدا",
    });
  }

  const oldUser = await Users.findOne({ email: req.body.email });

  if (oldUser) {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      msg: emailExist,
    });
  } else {
    const { username, email, password} = req.body;

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { password: password, email: email },
      process.env.S_key
    );

    try {
      await newUser.save();
      return res.json({
        status: "success",
        data: newUser,
        code: 201,
        msg: "تم التسجيل",
        token: token,
      });
    } catch (error) {
      return res.json({
        status: "error",
        data: null,
        code: 400,
        msg: "خطأ فى التسجيل",
      });
    }
  }
};

const loginUser = async (req, res) => {
  const valid = validationResult(req);
  if (!valid.isEmpty()) {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      errros: valid.array(),
      msg: "خطأ فى التسجيل - راجع المعلومات جيدا",
    });
  }
  const { email, password } = req.body;

  const user = await Users.findOne({ email: email });

  if (!user) {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      msg: "معلومات غير صحيحة",
    });
  }

  if (!email && !password) {
    res.json({
      status: "error",
      data: null,
      code: 400,
      msg: "لازم تكتب كل حاجة",
    });
  }

  try {
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (user && matchedPassword) {
      const token = jwt.sign(
        { password: password, email: email },
        process.env.S_key
      );
      return res.json({
        status: "success",
        data: user,
        code: 201,
        msg: "تم الدخول",
        token: token,
      });
    } else {
      return res.json({
        status: "error",
        data: null,
        code: 400,
        msg: "الايميل او الباسورد مش صح",
      });
    }
  } catch (er) {
    console.log(er, "error in login");
  }
};

const verifyUser = async (req, res) => {
  const auth = req.headers["Authorization"] || req.headers["authorization"];

  if (auth == undefined) {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      msg: "Token required",
    });
  }
  const token = auth.split(" ")[1];

  if (token == undefined) {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      msg: "Token required",
    });
  }

  try {
    const userDetails = jwt.verify(token, process.env.S_key);
    return res.json({
      status: "success",
      data: null,
      code: 200,
      msg: "User is auth",
      userDetails: userDetails,
    });
  } catch (er) {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      msg: "User is not auth",
      userDetails: null,
    });
  }
};

const getUser = async (req, res) => {
  const user = await Users.findById(req.params.userId);
  res.json({ status: "success", data: user });
};

const getUsers = async (req, res) => {
  console.log(req);

  const user = await Users.find();
  res.json({ status: "success", data: user });
};

module.exports = {
  getUser,
  getUsers,
  addUser,
  loginUser,
  verifyUser,
};
