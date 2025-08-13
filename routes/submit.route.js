const {addToFavorite
  } = require("../controllers/submit.controller");
  const exp = require("express");
  
  const router = exp.Router();
  
  router.post("/add_to_favorite", addToFavorite);
  module.exports = router;