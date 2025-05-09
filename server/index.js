import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

// Crear __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde el archivo .env en la raíz
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Crear conexión con soporte de Promesas
const db = mysql
  .createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  .promise();

// Endpoint para insertar una nueva pregunta
app.post("/api/preguntas", async (req, res) => {
  const { texto, tipo } = req.body;

  if (!texto || texto.trim() === "") {
    return res
      .status(400)
      .send("El texto de la pregunta no puede estar vacío.");
  }

  if (!["abierta", "cerrada"].includes(tipo)) {
    return res
      .status(400)
      .send("El tipo de pregunta debe ser 'abierta' o 'cerrada'.");
  }

  try {
    const [result] = await db.query(
      "INSERT INTO preguntas (texto, tipo) VALUES (?, ?)",
      [texto, tipo]
    );
    res.status(200).json({ id: result.insertId });
  } catch (err) {
    console.error("Error al guardar la pregunta:", err);
    res.status(500).send("Error al guardar la pregunta.");
  }
});

// Endpoint para insertar múltiples opciones asociadas a una pregunta
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
  const { estado } = req.query; // Leer el parámetro de consulta "estado"

  try {
    let query = "SELECT * FROM preguntas";
    const params = [];

    if (estado === "1") {
      query += " WHERE estado = 1"; // Solo preguntas activas
    } else if (estado === "0") {
      query += " WHERE estado = 0"; // Solo preguntas inactivas
    }

    const [results] = await db.query(query, params);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error al obtener las preguntas:", err);
    res.status(500).send("Error al obtener las preguntas");
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
    console.error("Error al actualizar la pregunta y opciones:", err);
    res.status(500).json({ mensaje: "Error en la actualización" });
  }
});

// Endpoint para eliminar una opción por ID
app.delete("/api/opciones/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM opciones WHERE id = ?", [id]);
    res.status(200).json({ mensaje: "Opción eliminada con éxito" });
  } catch (err) {
    console.error("Error al eliminar la opción:", err);
    res.status(500).json({ mensaje: "Error al eliminar la opción" });
  }
});

// Endpoint para obtener preguntas y sus opciones para el formulario
app.get("/api/formulario", async (req, res) => {
  try {
    // Obtener solo preguntas activas
    const [preguntas] = await db.query(
      "SELECT * FROM preguntas WHERE estado = 1"
    );

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
    return res.status(400).send("No se enviaron respuestas.");
  }

  try {
    for (const respuesta of respuestas) {
      const { pregunta_id, opcion_id, respuesta_abierta } = respuesta;

      if (!pregunta_id) {
        return res.status(400).send("El campo pregunta_id es obligatorio.");
      }

      // Verificar si la pregunta existe
      const [pregunta] = await db.query(
        "SELECT tipo FROM preguntas WHERE id = ?",
        [pregunta_id]
      );

      if (!pregunta || pregunta.length === 0) {
        return res.status(404).send("La pregunta no existe.");
      }

      if (pregunta[0].tipo === "abierta") {
        if (!respuesta_abierta || respuesta_abierta.trim() === "") {
          return res
            .status(400)
            .send(
              "La respuesta para una pregunta abierta no puede estar vacía."
            );
        }

        await db.query(
          "INSERT INTO respuestas (pregunta_id, respuesta_abierta) VALUES (?, ?)",
          [pregunta_id, respuesta_abierta]
        );
      } else {
        if (!opcion_id) {
          return res
            .status(400)
            .send("Debe seleccionarse una opción para preguntas cerradas.");
        }

        await db.query(
          "INSERT INTO respuestas (pregunta_id, opcion_id) VALUES (?, ?)",
          [pregunta_id, opcion_id]
        );
      }
    }

    res.status(200).send("Respuestas guardadas con éxito.");
  } catch (err) {
    console.error("Error al guardar la respuesta:", err);
    res.status(500).send("Error al guardar la respuesta.");
  }
});

// Endpoint para obtener las preguntas con sus opciones y votos
app.get("/api/preguntas/:id/votos", async (req, res) => {
  const { id } = req.params;

  try {
    const [pregunta] = await db.query("SELECT * FROM preguntas WHERE id = ?", [
      id,
    ]);

    if (!pregunta || pregunta.length === 0) {
      return res.status(404).send("La pregunta no existe.");
    }

    if (pregunta[0].tipo === "abierta") {
      // Obtener respuestas abiertas
      const [respuestas] = await db.query(
        "SELECT respuesta_abierta FROM respuestas WHERE pregunta_id = ?",
        [id]
      );
      return res.status(200).json({
        id: pregunta[0].id,
        texto: pregunta[0].texto,
        tipo: "abierta",
        datos: respuestas.map((r) => ({ texto: r.respuesta_abierta })),
      });
    } else {
      // Obtener opciones y votos para preguntas cerradas
      const [opciones] = await db.query(
        "SELECT id, texto FROM opciones WHERE pregunta_id = ?",
        [id]
      );
      const [respuestas] = await db.query(
        "SELECT opcion_id, COUNT(*) AS votos FROM respuestas WHERE pregunta_id = ? GROUP BY opcion_id",
        [id]
      );

      const datos = opciones.map((opcion) => {
        const respuesta = respuestas.find((r) => r.opcion_id === opcion.id);
        return {
          name: opcion.texto,
          value: respuesta ? respuesta.votos : 0,
        };
      });

      return res.status(200).json({
        id: pregunta[0].id,
        texto: pregunta[0].texto,
        tipo: "cerrada",
        datos,
      });
    }
  } catch (err) {
    console.error("Error al obtener los datos de la pregunta:", err);
    res.status(500).send("Error al obtener los datos de la pregunta.");
  }
});

// Endpoint para cambiar el estado de una pregunta (activar o inactivar)
app.put("/api/preguntas/:id/estado", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // Estado nuevo (1 para activo, 0 para inactivo)

  if (estado !== 0 && estado !== 1) {
    return res
      .status(400)
      .json({ mensaje: "Estado inválido. Debe ser 0 o 1." });
  }

  try {
    const [result] = await db.query(
      "UPDATE preguntas SET estado = ? WHERE id = ?",
      [estado, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Pregunta no encontrada" });
    }
    res
      .status(200)
      .json({ mensaje: `Pregunta actualizada a estado ${estado}` });
  } catch (err) {
    console.error("Error al actualizar el estado de la pregunta:", err);
    res
      .status(500)
      .json({ mensaje: "Error al actualizar el estado de la pregunta" });
  }
});

// Endpoint para obtener respuestas de una pregunta por ID
app.get("/api/preguntas/:id/respuestas", async (req, res) => {
  const { id } = req.params;

  try {
    const [pregunta] = await db.query("SELECT * FROM preguntas WHERE id = ?", [
      id,
    ]);

    if (!pregunta) {
      return res.status(404).send("La pregunta no existe.");
    }

    if (pregunta.tipo === "abierta") {
      const [respuestas] = await db.query(
        "SELECT respuesta_abierta FROM respuestas WHERE pregunta_id = ?",
        [id]
      );
      return res.status(200).json({ pregunta, respuestas });
    } else {
      const [opciones] = await db.query(
        "SELECT * FROM opciones WHERE pregunta_id = ?",
        [id]
      );
      const [respuestas] = await db.query(
        "SELECT opcion_id, COUNT(*) AS votos FROM respuestas WHERE pregunta_id = ? GROUP BY opcion_id",
        [id]
      );
      return res.status(200).json({ pregunta, opciones, respuestas });
    }
  } catch (err) {
    console.error("Error al obtener las respuestas:", err);
    res.status(500).send("Error al obtener las respuestas.");
  }
});

// Endpoint para verificar si un email ya respondió
app.get("/api/verificar-email/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const [result] = await db.query(
      "SELECT * FROM emails_respondidos WHERE email = ?",
      [email]
    );

    if (result.length > 0) {
      return res.status(200).json({ yaRespondio: true });
    }

    res.status(200).json({ yaRespondio: false });
  } catch (error) {
    console.error("Error al verificar el email:", error);
    res.status(500).send("Error al verificar el email.");
  }
});

// Endpoint para registrar un email
app.post("/api/registrar-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("El email es obligatorio.");
  }

  try {
    await db.query("INSERT INTO emails_respondidos (email) VALUES (?)", [
      email,
    ]);
    res.status(200).send("Email registrado con éxito.");
  } catch (error) {
    console.error("Error al registrar el email:", error);
    res.status(500).send("Error al registrar el email.");
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
