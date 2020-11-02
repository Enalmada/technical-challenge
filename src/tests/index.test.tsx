import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";

import { USERS } from "../apollo/queries-mutations";
import App from "../pages/index";

const mocks = [
    {
        request: {
            query: USERS
        },
        result: {
            data: {
                users: [{ id: "1", email: "user@test.com" }]
            }
        }
    }
];

describe("App", () => {
    it("renders without crashing", async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <App />
            </MockedProvider>
        );

        // Transition from loading to final state
        // https://www.apollographql.com/docs/react/development-testing/testing/
        // TODO: do this the right way https://github.com/apollographql/apollo-client/issues/5920#issuecomment-676934550
        // @ts-ignore
        await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0)));

        expect(screen.getByTestId("brand")).toBeInTheDocument();
    });
});
