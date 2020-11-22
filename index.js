const { ApolloServer, gql } = require("apollo-server");
const models = require("./models");

// unique-slug generates a minium of 4 alpha-numeric char string
const uniqueSlug = require("unique-slug");
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Url {
    id: String!
    originalUrl: String!
  }

  type Query {
    url: Url
  }

  type Mutation {
    createUrl(originalUrl: String!): Url
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    async url(root, { id }, { models }) {
      return models.URL.findByPk(id);
    }
  },
  Mutation: {
    async createUrl(root, { originalUrl, customDefinedUrl }, { models }) {
      const id = customDefinedUrl || uniqueSlug(originalUrl);
      return await models.URL.create({ originalUrl, id });
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
