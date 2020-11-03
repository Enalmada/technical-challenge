import { TypedTypePolicies } from "src/apollo/types/apollo-helpers";

// Generally need to put query types here to stop apollo from sending console logs about merging
// https://www.apollographql.com/docs/react/caching/cache-field-behavior/
const typePolicies: TypedTypePolicies = {
    Query: {
        fields: {
            tasks: {
                merge(_ignored, incoming) {
                    return incoming;
                }
            }
        }
    }
};

export default typePolicies;
