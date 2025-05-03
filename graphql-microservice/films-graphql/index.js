const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");

const app = express();
app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true, // Interfaz de prueba
}));

app.listen(4000, () => {
  console.log("Servidor GraphQL listo en http://localhost:4000/graphql");
});
