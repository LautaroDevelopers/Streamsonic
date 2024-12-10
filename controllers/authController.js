const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const conexion = require("../database/db");
const { promisify } = require("util");

// note: Registro de usuarios
exports.register = async (req, res) => {
  try {
    const {
      name,
      user,
      pass,
      email,
      phone,
      department,
      address,
      province,
      zipcode,
    } = req.body;
    let passHash = await bcryptjs.hash(pass, 8);

    conexion.query(
      "INSERT INTO users SET ?",
      {
        user: user,
        name: name,
        pass: passHash,
        email: email,
        phone: phone,
        department: department,
        address: address,
        province: province,
        zipcode: zipcode,
        sessions: 3, // Valor predeterminado para nuevas cuentas
      },
      (error, results) => {
        if (error) {
          console.log(error);
          return res.render("auth/register", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Hubo un problema con el registro",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "auth/register",
          });
        }
        res.redirect("/");
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// note: Inicio de sesión
exports.login = async (req, res) => {
  try {
    const user = req.body.user;
    const pass = req.body.pass;

    if (!user || !pass) {
      return res.render("auth/login", {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un usuario y password",
        alertIcon: "info",
        showConfirmButton: true,
        timer: false,
        ruta: "auth/login",
      });
    }

    conexion.query(
      "SELECT * FROM users WHERE user = ?",
      [user],
      async (error, results) => {
        if (
          results.length === 0 ||
          !(await bcryptjs.compare(pass, results[0].pass))
        ) {
          return res.render("auth/login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o Password incorrectas",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "auth/login",
          });
        }

        const userId = results[0].id;

        // Obtener el límite de sesiones desde la columna `sessions`
        const maxSessions = results[0].sessions || 3; // Valor predeterminado en caso de error

        // Verificar el número de sesiones activas
        conexion.query(
          "SELECT COUNT(*) AS active_count FROM active_sessions WHERE user_id = ?",
          [userId],
          (err, countResults) => {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .send("Error al verificar sesiones activas");
            }

            const activeSessions = countResults[0].active_count;

            if (activeSessions >= maxSessions) {
              return res.render("auth/login", {
                alert: true,
                alertTitle: "Límite alcanzado",
                alertMessage:
                  "El límite de inicios de sesión ha sido alcanzado. Cierre sesión en otro dispositivo e intente nuevamente.",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: "auth/login",
              });
            }

            // Crear sesión y registrar en la tabla active_sessions
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRETO);

            conexion.query(
              "INSERT INTO active_sessions (user_id, session_token) VALUES (?, ?)",
              [userId, token],
              (insertErr) => {
                if (insertErr) {
                  console.log(insertErr);
                  return res.status(500).send("Error al registrar la sesión");
                }

                const cookiesOptions = {
                  expires: new Date(
                    Date.now() +
                      process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                  ),
                  httpOnly: true,
                };

                res.cookie("jwt", token, cookiesOptions);
                return res.render("auth/login", {
                  alert: true,
                  alertTitle: "Conexión exitosa",
                  alertMessage: "¡LOGIN CORRECTO!",
                  alertIcon: "success",
                  showConfirmButton: false,
                  timer: 800,
                  ruta: "",
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error interno del servidor");
  }
};

// note: Comprobar si el usuario está autenticado
exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRETO
      );
      conexion.query(
        "SELECT * FROM users WHERE id = ?",
        [decodificada.id],
        (error, results) => {
          if (!results) {
            return next();
          }
          req.user = results[0];
          return next();
        }
      );
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    res.redirect("/home");
  }
};

// note: Cerrar sesión
exports.logout = (req, res) => {
  const token = req.cookies.jwt;

  conexion.query(
    "DELETE FROM active_sessions WHERE session_token = ?",
    [token],
    (error) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Error al cerrar sesión");
      }

      res.clearCookie("jwt");
      return res.redirect("/home");
    }
  );
};
