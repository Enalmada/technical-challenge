// Used to refresh client on backend change

export const typeDefs = `
    type Query {
      version: {
        backend: String!
      }
    }
  `;

export const resolvers = {
    Query: {
        version: () => ({ __typename: "Version", name: "Version" })
    },
    Mutation: {}
};
