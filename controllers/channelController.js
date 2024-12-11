const conexion = require("../database/db");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Obtener todos los canales y renderizarlos
exports.getChannels = (req, res) => {
  conexion.query("SELECT * FROM channels", (error, results) => {
    if (error) {
      console.error("Error al obtener los canales:", error);
      return res.status(500).send("Error al obtener los canales");
    }
    res.render("layouts/dashboard", {
      title: "TV",
      body: "../dashboard/channels",
      channels: results,
    });
  });
};

// Renderizar la vista de agregar canal
exports.addChannelView = (req, res) => {
  res.render("dashboard/add-channel");
};

// Agregar un canal
const LIMITE_TAMANIO = 500 * 1024; // 500 KB máximo

exports.uploadChannel = (req, res) => {
  const { name, video_url, category, location } = req.body;
  const logo = req.files?.logo; // Verifica que se haya recibido el archivo logo

  // Validaciones
  if (!logo) {
    return res.status(400).send("El logo es obligatorio.");
  }
  if (!name) {
    return res.status(400).send("El nombre del canal es obligatorio.");
  }
  if (!video_url) {
    return res.status(400).send("La URL del video es obligatoria.");
  }
  if (!category) {
    return res.status(400).send("La categoría es obligatoria.");
  }

  // Rutas del archivo
  const tempPath = path.join(__dirname, "../uploads/temp", logo.name);
  const finalPath = path.join(__dirname, "../uploads", logo.name);

  // Guarda temporalmente el archivo
  logo.mv(tempPath, (err) => {
    if (err) {
      console.error("Error al mover el logo:", err);
      return res.status(500).send("Error al procesar el logo.");
    }

    // Comprimir y guardar el logo
    sharp(tempPath)
      .resize({ width: 500 })
      .jpeg({ quality: 80 })
      .toFile(finalPath, (err, info) => {
        if (err) {
          console.error("Error al procesar la imagen:", err);
          fs.unlinkSync(tempPath); // Elimina el archivo temporal si ocurre un error
          return res.status(500).send("Error al procesar la imagen.");
        }

        // Eliminar el archivo temporal después de procesarlo
        fs.unlinkSync(tempPath);

        // Verificar el tamaño del archivo comprimido
        const stats = fs.statSync(finalPath);
        if (stats.size > LIMITE_TAMANIO) {
          fs.unlinkSync(finalPath); // Eliminar el archivo si no cumple con el tamaño
          return res.status(400).send("El logo debe ser menor a 500KB.");
        }

        // Inserción en la base de datos
        const logoUrl = `/uploads/${logo.name}`;
        const sql =
          "INSERT INTO channels (name, logo_url, video_url, category, location) VALUES (?, ?, ?, ?, ?)";
        conexion.query(
          sql,
          [name, logoUrl, video_url, category, location || null],
          (error) => {
            if (error) {
              console.error(
                "Error al insertar el canal en la base de datos:",
                error
              );
              fs.unlinkSync(finalPath); // Elimina el archivo si ocurre un error en la base de datos
              return res.status(500).send("Error al agregar el canal.");
            }

            // Redirige a la vista de agregar canal
            res.redirect("/add-channel");
          }
        );
      });
  });
};

// Obtener un canal específico por ID
exports.getChannelById = (req, res) => {
  const channelId = req.params.id;
  conexion.query(
    "SELECT * FROM channels WHERE id = ?",
    [channelId],
    (error, results) => {
      if (error) {
        console.error("Error al obtener el canal:", error);
        return res.status(500).send("Error al obtener el canal");
      }
      if (results.length === 0) {
        return res.status(404).send("Canal no encontrado");
      }
      res.render("dashboard/player", { channel: results[0] });
    }
  );
};
