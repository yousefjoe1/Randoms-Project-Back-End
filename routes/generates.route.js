  const exp = require("express");
const { getGenerates } = require("../controllers/getGenerates");
  
  const router = exp.Router();
  
  router.get("/generate", getGenerates);
  
  module.exports = router;