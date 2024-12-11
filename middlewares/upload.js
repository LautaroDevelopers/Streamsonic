const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/temp"); // Carpeta temporal
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filtro para tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo JPEG y PNG."), false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
