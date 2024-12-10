const express = require("express");
const router = express.Router();
const dashboard = require("./dashboard");
const auth = require("./auth");
const landing = require("./landing");

const authController = require("../controllers/authController");

// Middleware global para pasar la versión a todas las vistas
router.use((req, res, next) => {
  res.locals.VERSION = process.env.VERSION; // Variable de entorno VERSION
  next();
});

// note: landing
router.use("/home", landing);

// note: autenticación
router.use("/auth", auth);

// note: dashboard
router.use("/", authController.isAuthenticated, dashboard);

module.exports = router;
