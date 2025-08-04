const {
  loginUser,
  verifyUser,
  getUsers,
  addUser,
} = require("../controllers/users.controllers");
const exp = require("express");
const { regsiterValid, loginValid } = require("../middlewares/userValidation");

const router = exp.Router();

router.post("/register", regsiterValid(), addUser);
router.post("/login", loginValid(), loginUser);
router.get("/verify-user", verifyUser);
router.get("/", getUsers);

module.exports = router;