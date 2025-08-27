const {addToFavorite, likes
  } = require("../controllers/submit.controller");
  const exp = require("express");
  
  const router = exp.Router();
  
  router.post("/add_to_favorite", addToFavorite);
  router.post("/like_it", likes);
  module.exports = router;