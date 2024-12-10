const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");
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

// Ruta para mostrar radios
router.get("/fm", (req, res) => {
  conexion.query("SELECT * FROM radios", (err, results) => {
    if (err) throw err;
    res.render("layouts/dashboard", {
      radios: results,
      title: "Radios",
      body: "../dashboard/fm",
    });
  });
});

// Ruta para agregar un radio
router.get("/add-fm", (req, res) => {
  res.render("dashboard/add-fm");
});

router.post("/add-fm", (req, res) => {
  const { name, logo_url, stream_url, category, location } = req.body;
  conexion.query(
    "INSERT INTO radios (name, logo_url, stream_url, category, location) VALUES (?, ?, ?, ?, ?)",
    [name, logo_url, stream_url, category, location],
    (err) => {
      if (err) throw err;
      res.redirect("/fm");
    }
  );
});

router.get("/fm/:id", (req, res) => {
  const radioId = req.params.id;
  conexion.query(
    "SELECT * FROM radios WHERE id = ?",
    [radioId],
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        res.render("dashboard/fm-player", { radio: results[0] });
      } else {
        res.redirect("/fm");
      }
    }
  );
});

// Renderizado los canales en la vista TV
router.get("/tv", channelController.getChannels);

router.get("/add-channel", (req, res) => {
  res.render("dashboard/add-channel");
});

router.post("/add-channel", channelController.addChannel);

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
