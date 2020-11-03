import { UserInputError } from "apollo-server-errors";

export const validateInput = async (schema, input) => {
    return await schema.validate(input).catch(function (err) {
        throw new UserInputError(err.errors.join(","), {
            invalidArgs: err.params.path
        });
    });
};
