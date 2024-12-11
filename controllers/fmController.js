const conexion = require("../database/db");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Obtener todas las radios y renderizarlas
exports.getRadios = (req, res) => {
  conexion.query("SELECT * FROM radios", (error, results) => {
    if (error) {
      console.error("Error al obtener las radios:", error);
      return res.status(500).send("Error al obtener las radios");
    }
    res.render("layouts/dashboard", {
      title: "Radios",
      body: "../dashboard/fm",
      radios: results,
    });
  });
};

// Renderizar la vista de agregar radio
exports.addRadioView = (req, res) => {
  res.render("dashboard/add-fm");
};

// Agregar una radio
const LIMITE_TAMANIO = 500 * 1024; // 500 KB máximo

exports.uploadRadio = (req, res) => {
  const { name, stream_url, category, location } = req.body;
  const logo = req.files?.logo; // Verifica que se haya recibido el archivo logo

  // Validaciones
  if (!logo) {
    return res.status(400).send("El logo es obligatorio.");
  }
  if (!name) {
    return res.status(400).send("El nombre de la radio es obligatorio.");
  }
  if (!stream_url) {
    return res.status(400).send("La URL del audio es obligatoria.");
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
          "INSERT INTO radios (name, logo_url, stream_url, category, location) VALUES (?, ?, ?, ?, ?)";
        conexion.query(
          sql,
          [name, logoUrl, stream_url, category, location || null],
          (error) => {
            if (error) {
              console.error(
                "Error al insertar la radio en la base de datos:",
                error
              );
              fs.unlinkSync(finalPath); // Elimina el archivo si ocurre un error en la base de datos
              return res.status(500).send("Error al agregar la radio.");
            }

            // Redirige a la vista de agregar radio
            res.redirect("/add-fm");
          }
        );
      });
  });
};

// Obtener una radio específica por ID
exports.getRadioById = (req, res) => {
  const radioId = req.params.id;
  conexion.query(
    "SELECT * FROM radios WHERE id = ?",
    [radioId],
    (error, results) => {
      if (error) {
        console.error("Error al obtener la radio:", error);
        return res.status(500).send("Error al obtener la radio");
      }
      if (results.length === 0) {
        return res.status(404).send("Radio no encontrada");
      }
      res.render("dashboard/fm-player", { radio: results[0] });
    }
  );
};
