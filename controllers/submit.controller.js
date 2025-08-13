const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Interactions = require("../models/interactionSchema.model");
const usersModel = require("../models/users.model");

const addToFavorite = async (req, res) => {
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

  const { id, type } = req.body.item;
  // Check user by token, not by req.params.userId
  let userId;
  try {
    const userDetails = jwt.verify(token, process.env.S_key);
    userId = userDetails.id;
  } catch (err) {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      msg: "Invalid or expired token",
    });
  }

  const existing = await Interactions.findOne({
    user: userId,
    contentId: id,
    contentType: type,
  });
  if (!existing) {
    console.log("🚀 ~ addToFavorite ~ existing:", existing);

    const resp = await Interactions.create({
      user: userId,
      contentId: id,
      contentType: type,
      isFavorite: true,
      favoritedAt: new Date(),
    });

    return res.json({ 
      isFavorited: true,
      status: "success",
      data: null,
      code: 200,
      msg: "Added to favorites",
     });
  }else{
    return res.json({
      status: "success",
      data: null,
      code: 200,
      msg: "Already in favorites",
    });
  }
};

module.exports = {
  addToFavorite,
};
