
const express = require("express");
const cors = require("cors");
const { request, gql } = require("graphql-request");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4002;
let sessionToken = null;

app.get("/", (req, res) => {
  res.send(" Bienvenido. Usa POST /login primero.");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await axios.post("http://localhost:4003/login", { username, password });
    sessionToken = response.data.token;
    res.json({ token: sessionToken });
  } catch (error) {
    sessionToken = null;
    res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }
});

const requireLogin = (req, res, next) => {
  if (!sessionToken) {
    return res.status(403).json({ error: " Debes iniciar sesión en /login primero" });
  }
  next();
};

const FILMS_QUERY = gql`
  query {
    films {
      film_id
      title
      release_year
      length
      rental_rate
      replacement_cost
      rating
      special_features
    }
  }
`;

const getFilms = async () => {
  const response = await request({
    url: "http://localhost:4000/graphql",
    document: FILMS_QUERY,
    requestHeaders: {
      Authorization: `Bearer ${sessionToken}`
    }
  });
  return response.films;
};

app.get("/films", requireLogin, async (req, res) => {
  try {
    const films = await getFilms();
    res.json(films);
  } catch (error) {
    console.error("Error en /films:", error.message);
    res.status(500).json({ error: "Error al obtener películas" });
  }
});

app.get("/film-stats", requireLogin, async (req, res) => {
  try {
    const films = await getFilms();
    if (!Array.isArray(films) || films.length === 0) {
      return res.json({});
    }

    const years = films.map(f => parseInt(f.release_year)).filter(Boolean);
    const lengths = films.map(f => f.length || 0);
    const rentalRates = films.map(f => f.rental_rate || 0);
    const ratings = {};
    const features = {};

    films.forEach(f => {
      // Contador por clasificación
      if (f.rating) {
        ratings[f.rating] = (ratings[f.rating] || 0) + 1;
      }
      // Contador por características especiales
      if (f.special_features) {
        f.special_features.split(',').forEach(feat => {
          const trimmed = feat.trim();
          features[trimmed] = (features[trimmed] || 0) + 1;
        });
      }
    });

    const total = years.length;
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const avgYear = parseFloat((years.reduce((a, b) => a + b, 0) / total).toFixed(2));
    const avgLength = parseFloat((lengths.reduce((a, b) => a + b, 0) / total).toFixed(2));
    const avgRentalRate = parseFloat((rentalRates.reduce((a, b) => a + b, 0) / total).toFixed(2));

    res.json({
      total,
      minYear,
      maxYear,
      avgYear,
      avgLength,
      avgRentalRate,
      ratings,
      features
    });

  } catch (error) {
    console.error("Error en /film-stats:", error.message);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

app.listen(PORT, () => {
  console.log(` Microservicio corriendo en http://localhost:${PORT}`);
});
