const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList
} = require("graphql");
const db = require("./db");

// Definir el tipo Film
const FilmType = new GraphQLObjectType({
  name: "Film",
  fields: () => ({
    film_id: { type: GraphQLInt },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    release_year: { type: GraphQLInt },
    language_id: { type: GraphQLInt },
    length: { type: GraphQLInt },              // duración en minutos
    rating: { type: GraphQLString },           // clasificación: G, PG, R...
    rental_rate: { type: GraphQLFloat },       // precio por renta
    replacement_cost: { type: GraphQLFloat },  // costo de reposición
    special_features: { type: GraphQLString }, // características especiales
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    films: {
      type: new GraphQLList(FilmType),
      resolve: async () => {
        const [rows] = await db.query("SELECT * FROM film LIMIT 20");
        return rows;
      },
    },
    film: {
      type: FilmType,
      args: { id: { type: GraphQLInt } },
      resolve: async (_, args) => {
        const [rows] = await db.query("SELECT * FROM film WHERE film_id = ?", [args.id]);
        return rows[0];
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
