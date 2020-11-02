import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-micro";
import UserService from "src/backend/services/UserService";

import resolvers from "../../backend/apollo/Resolvers";
import typeDefs from "../../backend/apollo/TypeDefs";
import { firebaseAdmin } from "../../utils/auth/firebaseAdmin";

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false
    }
};

// TODO: convert resolvers to schema file using @graphql-tools/graphql-file-loader

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, _connection }) => {
        if (req.headers.authorization) {
            // get the user from the request
            const token = await firebaseAdmin.auth().verifyIdToken(req.headers.authorization);
            const { uid, email } = token;

            const user = await UserService.createOrGetUser(prisma, uid, email);

            return {
                user: user,
                prisma: prisma
            };
        } else {
            return {
                prisma: prisma
            };
        }
    }
});

export default apolloServer.createHandler({ path: "/api/graphql" });
