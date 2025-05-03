const { request, gql } = require("graphql-request");
const { loginAndGetToken } = require("./authService");

const GRAPHQL_URL = "http://localhost:4001/graphql";

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

module.exports = { getFilms };
