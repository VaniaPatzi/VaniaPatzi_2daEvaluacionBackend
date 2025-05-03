const { request, gql } = require("graphql-request");
const axios = require("axios");

const AUTH_URL = "http://localhost:4003/login";
const GRAPHQL_URL = "http://localhost:4000/graphql";

// Obtiene el token del microservicio de login
const getToken = async () => {
  const response = await axios.post(AUTH_URL, {
    username: "admin",
    password: "admin123"
  });
  return response.data.token;
};

// Consulta con todos los campos útiles del backend
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

// Llama al endpoint GraphQL usando el token
const getFilms = async () => {
  const token = await getToken();
  const response = await request({
    url: GRAPHQL_URL,
    document: FILMS_QUERY,
    requestHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.films;
};

module.exports = { getFilms, getToken };
