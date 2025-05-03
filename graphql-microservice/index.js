const express = require("express");
const cors = require("cors");
const { getFilms } = require("./graphqlClient");

const app = express();
app.use(cors());

const PORT = 4002;

app.get("/film-stats", async (req, res) => {
  try {
    const films = await getFilms();

    if (!films.length) {
      return res.json({ total: 0, minYear: null, maxYear: null, avgYear: null });
    }

    const years = films.map(f => f.release_year);
    const total = years.length;
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const avgYear = parseFloat((years.reduce((a, b) => a + b, 0) / total).toFixed(2));

    res.json({ total, minYear, maxYear, avgYear });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error al obtener estadísticas de películas" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Microservicio en http://localhost:${PORT}/film-stats`);
});
