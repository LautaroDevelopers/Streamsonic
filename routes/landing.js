const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("layouts/landing", { content: "../landing/home", title: "Home" });
});
router.get("/politicas", (req, res) => {
  res.render("layouts/landing", {
    content: "../landing/politicas",
    title: "Políticas de privacidad",
  });
});
router.get("/condiciones", (req, res) => {
  res.render("layouts/landing", {
    content: "../landing/condiciones",
    title: "Condiciones de uso",
  });
});

module.exports = router;
