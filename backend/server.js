const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const preciosPath = path.join(__dirname, "precios.json");

app.get("/precios", (req, res) => {
  try {
    const data = fs.readFileSync(__dirname + "/precios.json", "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error leyendo precios:", err);
    res.status(500).json({ error: "No se pudo leer precios" });
  }
});

app.post("/precios", (req, res) => {
  try {
    fs.writeFileSync(preciosPath, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (error) {
    console.error("Error guardando precios:", error);
    res.status(500).json({ error: "Error guardando precios" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
