const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { quotes,advices,jokes } = require("../data/data");

const qoutesData = quotes;
const advicesData = advices;
const jokesData = jokes;

const allData = [...qoutesData, ...advicesData, ...jokesData];

const Interactions = require("../models/interactionSchema.model");

let start = 0;
const getGenerates = async (req, res) => {
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

  const userDetails = jwt.verify(token, process.env.S_key);

  
  const { query } = req;
  if (query.type == "quote") {
    start += 1;
    if (start > qoutesData.length - 1) {
      start = 0;
    }
    const findeItem = await Interactions.findOne({user: userDetails.id, contentId :start, contentType: "quote"});
    if(findeItem == null) {
      const currentItem = {...qoutesData[start],isFavorite: true,
        isLiked: false,};
      return res.json({
        code: 201,
        data: currentItem,
      });

    }else {
      
      return res.json({
        status: "success",
        code: 201,
        data: {...qoutesData[start],isFavorite: false,
          isLiked: false,},
      });
    }
    console.log("🚀 ~ getGenerates ~ fia:", fia)
  }
  if (query.type == "advice") {
    start += 1;
    if (start > advicesData.length - 1) {
      start = 0;
    }
    return res.json({
      status: "success",
      code: 201,
      data: advicesData[start],
    });
  }
  
  
  // jokes
  if (query.type == "joke") {
    start += 1;
    if (start > jokesData.length - 1) {
      start = 0;
    }
    return res.json({
      status: "success",
      code: 201,
      data: jokesData[start],
    });
  }


  const randomIndex = Math.floor(Math.random() * allData.length);
  if (query.type == "random") {
    return res.json({
      status: "success",
      code: 201,
      data: allData[randomIndex],
    });
  }



  return res.json({
    status: "success",
    code: 201,
    data: null,
  });
};

module.exports = {
  getGenerates,
};
