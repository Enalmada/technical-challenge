import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

/*
    DateTime UTC Support
 */
export default new GraphQLScalarType({
    name: "UTCDateTime",
    description: "UTC DateTime custom scalar type",
    parseValue(value) {
        return new Date(value);
    },
    serialize(value) {
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    }
});
