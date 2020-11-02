import Mutation from "./Mutation";
import Query from "./Query";
import UTCDateTimeScalarType from "./UTCDateTime";

const Resolvers = {
    UTCDateTime: UTCDateTimeScalarType,
    Query,
    Mutation
};

export { Resolvers as default };
