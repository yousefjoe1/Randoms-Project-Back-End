const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { quotes, advices, jokes } = require("../data/data");

const qoutesData = quotes;
const advicesData = advices;
const jokesData = jokes;

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

  let theItem = {};

  if (type == "quote") {
    theItem = qoutesData.filter((item) => item.id === id)[0];
  } else if (type == "advice") {
    theItem = advices.filter((item) => item.id === id)[0];
  } else if (type == "joke") {
    theItem = jokes.filter((item) => item.id === id)[0];
  }

  if (!existing) {
    const resp = await Interactions.create({
      user: userId,
      contentId: id,
      itemContent: theItem,
      contentType: type,
      isFavorite: true,
      favoritedAt: new Date(),
    });

    return res.json({
      isFavorite: resp.isFavorite,
      status: "success",
      data: null,
      code: 200,
      msg: "Added to favorites",
    });
  } else {
    const newFavoriteStatus = existing.isFavorite;
    const resp = await Interactions.findOneAndUpdate(
      {
        _id: existing._id,
        user: userId,
        contentId: id,
        contentType: type,
      },
      {
        isFavorite: !newFavoriteStatus,
        favoritedAt: new Date(),
      },
      { new: true }
    );

    return res.json({
      status: "success",
      data: null,
      code: 200,
      msg: "Updated favorite status",
      isFavorite: !newFavoriteStatus,
    });
  }
};

const likes = async (req, res) => {
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
    const resp = await Interactions.create({
      user: userId,
      contentId: id,
      contentType: type,
      isLiked: true,
      likedAt: new Date(),
    });

    return res.json({
      isLiked: true,
      status: "success",
      data: resp,
      code: 200,
      msg: "Added to likes",
    });
  } else {
    const newLikeStatus = existing.isLiked;
    const resp = await Interactions.findOneAndUpdate(
      {
        _id: existing._id,
        user: userId,
        contentId: id,
        contentType: type,
      },
      {
        isLiked: !newLikeStatus,
        likedAt: new Date(),
      },
      { new: true }
    );
    return res.json({
      status: "success",
      data: null,
      code: 200,
      msg: "Updated like status",
      isLiked: !newLikeStatus,
    });
  }
};

module.exports = {
  addToFavorite,
  likes,
};
