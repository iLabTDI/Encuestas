import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Cambia el usuario si es necesario
  password: "Ragnarok76_iLab", // Cambiar password si es necesario
  database: "encuesta_udg", // Asegúrate de que esta base de datos existe
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

app.post("/api/preguntas", (req, res) => {
  const { texto } = req.body;
  if (!texto || texto.trim() === "") {
    return res
      .status(400)
      .send("El texto de la pregunta no puede estar vacío.");
  }

  // 1. Insertar la pregunta en la base de datos
  const queryInsert = "INSERT INTO preguntas (texto) VALUES (?)";
  db.query(queryInsert, [texto], (err, result) => {
    if (err) {
      console.error("Error al insertar en la base de datos:", err);
      res.status(500).send("Error al guardar la pregunta");
      return;
    }

    // 2. Buscar el ID de la pregunta que acabamos de insertar
    const querySearch = "SELECT id FROM preguntas WHERE texto = ?";
    db.query(querySearch, [texto], (err, rows) => {
      if (err) {
        console.error("Error al buscar la pregunta:", err);
        res.status(500).send("Error al buscar la pregunta");
        return;
      }

      if (rows.length > 0) {
        // 3. Devolver el id de la pregunta insertada
        res.status(200).json({ id: rows[0].id });
      } else {
        res.status(404).send("Pregunta no encontrada después de insertar.");
      }
    });
  });
});

app.post("/api/opciones/multiple", (req, res) => {
  const { pregunta_id, opciones } = req.body;

  if (!pregunta_id || !opciones || opciones.length === 0) {
    return res
      .status(400)
      .send("Faltan datos necesarios: pregunta_id y opciones.");
  }

  const query = "INSERT INTO opciones (pregunta_id, texto) VALUES ?";
  const valores = opciones.map((texto) => [pregunta_id, texto]);

  db.query(query, [valores], (err, result) => {
    if (err) {
      console.error("Error al insertar las opciones en la base de datos:", err);
      res.status(500).send("Error al guardar las opciones");
      return;
    }
    res.status(200).send("Opciones guardadas con éxito");
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
