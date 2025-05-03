const express = require("express");
const cors = require("cors");
const { request, gql } = require("graphql-request");
const axios = require("axios");


const app = express();
app.use(cors());

const PORT = 4002;
const LOGIN_URL = "http://localhost:4001/api/auth/login";
const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql";

// Paso 1: Login y obtener token JWT
const loginAndGetToken = async () => {
  const response = await axios.post(LOGIN_URL, {
    username: "admin",    // tu usuario real
    password: "admin123"  // tu contraseña real
  });
  return response.data.token;
};

const FILMS_QUERY = gql`
  query {
    films {
      film_id
      release_year
    }
  }
`;

const getFilms = async () => {
    const token = await loginAndGetToken();
  
    const response = await request({
      url: GRAPHQL_URL,
      document: FILMS_QUERY,
      requestHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.films;
  };

app.get("/film-stats", async (req, res) => {
  try {
    const data = await request(GRAPHQL_ENDPOINT, FILMS_QUERY);
    const films = data.films;

    if (!films.length) {
      return res.json({ total: 0, minYear: null, maxYear: null, avgYear: null });
    }

    const years = films.map(f => f.release_year);
    const total = years.length;
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const avgYear = parseFloat((years.reduce((a, b) => a + b, 0) / total).toFixed(2));

    res.json({ total, minYear, maxYear, avgYear });
  } catch (err) {
    console.error("❌ Error al consultar GraphQL:", err.message);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

app.listen(PORT, () => {
  console.log(`📡 Microservicio corriendo en http://localhost:${PORT}/film-stats`);
});
