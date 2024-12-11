const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");
const fmController = require("../controllers/fmController");
const conexion = require("../database/db");

// Ruta principal
router.get("/", (req, res) => {
  conexion.query("SELECT * FROM channels", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error al obtener los canales");
    } else {
      res.render("layouts/dashboard", {
        title: "Dashboard",
        body: "../dashboard/home",
        channels: results,
      });
    }
  });
});

// Ruta para ver todas las emisoras FM
router.get("/fm", fmController.getRadios);

// Ruta para ver el formulario de agregar emisora FM
router.get("/add-fm", fmController.addRadioView);

// Ruta para subir una emisora FM
router.post("/add-fm", fmController.uploadRadio);

// Ruta para ver detalles de una emisora FM por ID
router.get("/fm/:id", fmController.getRadioById);

// Renderizado los canales en la vista TV
router.get("/tv", channelController.getChannels);

router.get("/add-channel", channelController.addChannelView);

router.post("/add-channel", channelController.uploadChannel);

// Ruta para reproducir un canal
router.get("/channel/:id", channelController.getChannelById);

router.get("/profile", (req, res) => {
  res.render("layouts/dashboard", {
    user: req.user,
    title: "Perfil",
    body: "../dashboard/profile",
  });
});

module.exports = router;
