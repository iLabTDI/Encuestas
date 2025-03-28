import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Crear conexión con soporte de Promesas
const db = mysql
  .createConnection({
    host: "localhost",
    user: "root",
    password: "Ragnarok76_iLab",
    database: "encuesta_udg",
  })
  .promise();

// Endpoint para insertar una nueva pregunta
app.post("/api/preguntas", async (req, res) => {
  const { texto } = req.body;
  if (!texto || texto.trim() === "") {
    return res
      .status(400)
      .send("El texto de la pregunta no puede estar vacío.");
  }

  try {
    // Insertar la pregunta
    const [result] = await db.query(
      "INSERT INTO preguntas (texto) VALUES (?)",
      [texto]
    );

    // Devolver el ID de la pregunta insertada
    res.status(200).json({ id: result.insertId });
  } catch (err) {
    console.error("Error al insertar en la base de datos:", err);
    res.status(500).send("Error al guardar la pregunta");
  }
});

// Endpoint para insertar múltiples opciones
app.post("/api/opciones/multiple", async (req, res) => {
  const { pregunta_id, opciones } = req.body;

  if (!pregunta_id || !opciones || opciones.length === 0) {
    return res
      .status(400)
      .send("Faltan datos necesarios: pregunta_id y opciones.");
  }

  try {
    const query = "INSERT INTO opciones (pregunta_id, texto) VALUES ?";
    const valores = opciones.map((texto) => [pregunta_id, texto]);

    await db.query(query, [valores]);
    res.status(200).send("Opciones guardadas con éxito");
  } catch (err) {
    console.error("Error al insertar las opciones en la base de datos:", err);
    res.status(500).send("Error al guardar las opciones");
  }
});

// Endpoint para obtener todas las preguntas
app.get("/api/preguntas", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM preguntas");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error al obtener preguntas:", err);
    res.status(500).send("Error al obtener preguntas");
  }
});

// Endpoint para eliminar una pregunta por ID
app.delete("/api/preguntas/:id", async (req, res) => {
  const preguntaId = req.params.id;

  try {
    await db.query("DELETE FROM preguntas WHERE id = ?", [preguntaId]);
    res.status(200).send("Pregunta eliminada con éxito");
  } catch (err) {
    console.error("Error al eliminar la pregunta:", err);
    res.status(500).send("Error al eliminar la pregunta");
  }
});

// Endpoint para obtener una pregunta con sus opciones por ID
app.get("/api/preguntas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [pregunta] = await db.query("SELECT * FROM preguntas WHERE id = ?", [
      id,
    ]);
    const [opciones] = await db.query(
      "SELECT * FROM opciones WHERE pregunta_id = ?",
      [id]
    );

    if (pregunta.length === 0) {
      return res.status(404).json({ mensaje: "Pregunta no encontrada" });
    }

    res.json({
      id: pregunta[0].id,
      texto: pregunta[0].texto,
      opciones: opciones.map((o) => ({ id: o.id, texto: o.texto })),
    });
  } catch (err) {
    console.error("Error al obtener la pregunta:", err);
    res.status(500).json({ mensaje: "Error al obtener la pregunta" });
  }
});

// Endpoint para actualizar una pregunta y sus opciones
app.put("/api/preguntas/:id", async (req, res) => {
  const { id } = req.params;
  const { texto, opciones } = req.body;

  try {
    // Actualizar el texto de la pregunta
    await db.query("UPDATE preguntas SET texto = ? WHERE id = ?", [texto, id]);

    // Actualizar o insertar opciones
    for (const opcion of opciones) {
      if (opcion.id) {
        // Actualizar opción existente
        await db.query("UPDATE opciones SET texto = ? WHERE id = ?", [
          opcion.texto,
          opcion.id,
        ]);
      } else {
        // Insertar nueva opción
        await db.query(
          "INSERT INTO opciones (pregunta_id, texto) VALUES (?, ?)",
          [id, opcion.texto]
        );
      }
    }

    res.status(200).json({ mensaje: "Pregunta y opciones actualizadas" });
  } catch (err) {
    console.error("Error al actualizar:", err);
    res.status(500).json({ mensaje: "Error en la actualización" });
  }
});

// Endpoint para eliminar una opción por ID
app.delete("/api/opciones/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM opciones WHERE id = ?", [id]);
    res.status(200).json({ mensaje: "Opción eliminada" });
  } catch (err) {
    console.error("Error al eliminar opción:", err);
    res.status(500).json({ mensaje: "Error al eliminar opción" });
  }
});

//Obtiene las preguntas y sus opciones para el formulario
app.get("/api/formulario", async (req, res) => {
  try {
    const [preguntas] = await db.query("SELECT * FROM preguntas");

    const preguntasConOpciones = await Promise.all(
      preguntas.map(async (pregunta) => {
        const [opciones] = await db.query(
          "SELECT * FROM opciones WHERE pregunta_id = ?",
          [pregunta.id]
        );
        return { ...pregunta, opciones };
      })
    );

    res.status(200).json(preguntasConOpciones);
  } catch (err) {
    console.error("Error al obtener el formulario:", err);
    res.status(500).json({ mensaje: "Error al obtener el formulario" });
  }
});

// Endpoint para enviar respuestas
app.post("/api/respuestas", async (req, res) => {
  const { respuestas } = req.body;

  if (!respuestas || respuestas.length === 0) {
    return res.status(400).send("No se han recibido respuestas");
  }

  try {
    const query = "INSERT INTO respuestas (pregunta_id, opcion_id) VALUES ?";
    const valores = respuestas.map((r) => [r.pregunta_id, r.opcion_id]);

    await db.query(query, [valores]);
    res.status(200).send("Respuestas guardadas con éxito");
  } catch (err) {
    console.error("Error al guardar las respuestas:", err);
    res.status(500).send("Error al guardar las respuestas");
  }
});

// Endpoint para obtener las preguntas con sus opciones y votos
app.get("/api/preguntas/:id/votos", async (req, res) => {
  const { id } = req.params;

  try {
    const [pregunta] = await db.query("SELECT * FROM preguntas WHERE id = ?", [
      id,
    ]);
    if (pregunta.length === 0) {
      return res.status(404).json({ mensaje: "Pregunta no encontrada" });
    }

    const [opciones] = await db.query(
      `SELECT o.id AS opcion_id, o.texto AS opcion_texto, COUNT(r.id) AS votos
       FROM opciones o
       LEFT JOIN respuestas r ON o.id = r.opcion_id
       WHERE o.pregunta_id = ?
       GROUP BY o.id`,
      [id]
    );

    res.status(200).json({
      id: pregunta[0].id,
      texto: pregunta[0].texto,
      datos: opciones.map((opcion) => ({
        name: opcion.opcion_texto,
        value: opcion.votos,
      })),
    });
  } catch (err) {
    console.error("Error al obtener la pregunta con votos:", err);
    res.status(500).json({ mensaje: "Error al obtener la pregunta con votos" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
