const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", (req, res) => {
  res.render("auth/login", { alert: false });
});
router.get("/register", authController.isAuthenticated, (req, res) => {
  res.render("auth/register");
});

//router para los métodos del controller
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;
