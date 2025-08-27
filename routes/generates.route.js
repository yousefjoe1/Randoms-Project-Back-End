const exp = require("express");
const { getGenerates ,getDataByType} = require("../controllers/getGenerates.controller.js");

const router = exp.Router();

router.get("/generate", getGenerates);

router.get("/get-items", getDataByType);

module.exports = router;
