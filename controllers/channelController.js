const conexion = require("../database/db");

// note:Obtener todos los canales y renderizarlos
exports.getChannels = (req, res) => {
  conexion.query("SELECT * FROM channels", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error al obtener los canales");
    } else {
      res.render("layouts/dashboard", {
        title: "TV",
        body: "../dashboard/channels",
        channels: results,
      });
    }
  });
};

// note:Agregar un canal
exports.addChannel = (req, res) => {
  const { name, logo_url, video_url, category, location } = req.body;
  conexion.query(
    "INSERT INTO channels (name, logo_url, video_url, category, location) VALUES (?, ?, ?, ?, ?)",
    [name, logo_url, video_url, category, location],
    (err) => {
      if (err) throw err;
      res.redirect("/tv");
    }
  );
};

// note:Obtener un canal específico por ID
exports.getChannelById = (req, res) => {
  const channelId = req.params.id;
  conexion.query(
    "SELECT * FROM channels WHERE id = ?",
    [channelId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error al obtener el canal");
      } else if (results.length === 0) {
        res.status(404).send("Canal no encontrado");
      } else {
        res.render("dashboard/player", { channel: results[0] });
      }
    }
  );
};
