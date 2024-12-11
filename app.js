const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const fileUpload = require("express-fileupload");

const app = express();

//seteamos el motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//seteamos la carpeta public para archivos estáticos
app.use(express.static("public"));

//para procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//seteamos las variables de entorno
dotenv.config({ path: "./env/.env" });

//para poder trabajar con las cookies
app.use(cookieParser());

//llamar al router
app.use("/", require("./routes/router"));

//Para eliminar la cache
app.use(function (req, res, next) {
  if (!req.user)
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  next();
});

app.listen(3000, () => {
  console.log("SERVER UP runnung in http://localhost:3000");
});
