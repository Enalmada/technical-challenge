import { ApolloClient, ApolloLink, InMemoryCache, Observable, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import * as Sentry from "@sentry/node";
import ApolloLinkTimeout from "apollo-link-timeout";
import { createUploadLink } from "apollo-upload-client";
import gql from "graphql-tag";
import fetch from "isomorphic-unfetch";
import Router from "next/router";
import { parseCookies } from "nookies";

import { resolvers, typeDefs } from "./resolvers";
import typePolicies from "./typePolicies";

// This is the apollo client setup

// createPersistedQueryLink only works on permanent routes
// import { createPersistedQueryLink } from "apollo-link-persisted-queries";

// TODO - get token on backend out of server only cookie
export async function getToken(req, res): Promise<string | null> {
    if (typeof window === "undefined") {
        if (!res) {
            throw new Error("Response is not available");
        }
        if (!req) {
            throw new Error("Request is not available");
        }

        return req.cookies.token;
    } else {
        const cookies = parseCookies();
        return cookies.token;
    }
}

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 * @param  {Object} ctx
 */
// eslint-disable-next-line no-shadow
export default function apolloClient(initialState: any, ctx: any): ApolloClient<any> {
    const { req, res } = ctx || {};
    const fetchOptions = {};

    const maintenancePagePath = "/maintenance-mode";

    // https://github.com/apollographql/subscriptions-transport-ws/issues/333#issuecomment-359261024
  /* eslint-disable */

  const wsLink = process.browser && process.env.NEXT_PUBLIC_APOLLO_URL_WS
    ? new WebSocketLink({
        uri: process.env.NEXT_PUBLIC_APOLLO_URL_WS,
        options: {
          reconnect: true
        }
      })
    : null;
  /* eslint-enable */

    // https://github.com/apollographql/apollo-link/issues/197#issuecomment-353253499
    // https://github.com/apollographql/apollo-server/issues/1505#issuecomment-419126391
    const subscriptionMiddleware = {
        applyMiddleware: function (options, next) {
            // Get the current context
            const context = options.getContext();
            // set it on the `options` which will be passed to the websocket with Apollo
            // Server it becomes: `ApolloServer({contetx: ({payload}) => (returns options)
            options.authorization = context.authorization;
            next();
        }
    };

    // add the middleware to the web socket link via the Subscription Transport client

    /* eslint-disable */
  // @ts-ignore
  process.browser && wsLink ? wsLink.subscriptionClient.use([subscriptionMiddleware]) : null;
    /* eslint-enable */

    // Seems like createUploadLink is a superset of the normal link
    const httpLink = createUploadLink({
        uri: process.env.NEXT_PUBLIC_APOLLO_URL,
        headers: {
            "keep-alive": "true"
        },
        credentials: "include",
        fetch,
        fetchOptions
    });

    // https://github.com/apollographql/apollo-client/issues/3090#issuecomment-390057662
    interface Definition {
        kind: string;
        operation?: string;
    }

    /* eslint-disable */
  const splitLink = process.browser && wsLink
    ? split(
      ({ query }) => {
        const { kind, operation }: Definition = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      httpLink
    )
    : httpLink;
  /* eslint-enable */

    const getTokenFunc = async (): Promise<string | null> => await getToken(req, res);

    const authLink = setContext(async (request, response) => {
        // Don't bother getting token for public operations
        const token = await getTokenFunc();
        return {
            authorization: token ? token : "", // for Subscription
            headers: {
                ...response.headers,
                authorization: token ? token : ""
            }
        };
    });

    const loggerLink = new ApolloLink((operation, forward) => {
        // console.log(`GraphQL Request: ${operation.operationName}`); // eslint-disable-line no-console
        // operation.setContext({ start: new Date() });
        return forward(operation).map((response) => {
            // if(process.env.NODE_ENV === "development") {
            //   const responseTime = new Date() - operation.getContext().start;
            //   console.log(`GraphQL Response took: ${responseTime}`); // eslint-disable-line no-console
            // }
            return response;
        });
    });

    const GET_BACKEND_VERSION = gql`
        query BackendVersion {
            version @client {
                backend
            }
        }
    `;

    const responseLogger = new ApolloLink((operation, forward) => {
        // I am getting forward(...).map is not a function from the activity list subscriptions
        // I can't figure out why but this seems to solve my problem.
        if (forward === undefined) {
            return undefined;
        }

        return forward(operation).map((result) => {
            // Subscriptions (websocket) doesn't have headers
            if (operation?.getContext()?.response?.headers) {
                const headers = operation.getContext().response.headers;
                const backendVersion = headers.get("x-version-backend") || [];
                const { cache } = operation.getContext();
                const original = cache.readQuery({ query: GET_BACKEND_VERSION });
                const storedBackendVersion = original.version.backend;

                if (backendVersion.includes("maintenance_mode")) {
                    if (typeof window !== "undefined") {
                        Router.push(maintenancePagePath);
                    } else {
                        if (res) {
                            res.writeHead(302, {
                                Location: maintenancePagePath
                            });
                            res.end();
                        }
                    }
                }

                // First graphql query will store backend version
                if (backendVersion !== storedBackendVersion) {
                    const needToReload = storedBackendVersion !== "fresh";
                    const data = {
                        version: {
                            backend: backendVersion,
                            __typename: "Version"
                        }
                    };
                    cache.writeQuery({ query: GET_BACKEND_VERSION, data });

                    if (needToReload && typeof window !== "undefined") {
                        window.__needsReload = true;
                    }
                }
            }

            return result;
        });
    });

    const timeoutLink = new ApolloLinkTimeout(30000); // 30 second timeout

    // https://medium.com/@joanvila/productionizing-apollo-links-4cdc11d278eb
    const retryIf = (error): boolean => {
        const doNotRetryCodes = [500, 400, 401, 429];
        return (
            !!error &&
            !doNotRetryCodes.includes(error.statusCode) &&
            error.graphQLErrors?.[0].extensions.code !== "MAINTENANCE_MODE" &&
            error.graphQLErrors?.[0].extensions.code !== "EXPECTED_SERVER_ERROR" &&
            error.graphQLErrors?.[0].extensions.code !== "BAD_USER_INPUT"
        );
    };

    const retryLink = new RetryLink({
        delay: {
            initial: 1000,
            max: Infinity,
            jitter: true
        },
        attempts: {
            max: 5,
            retryIf
        }
    });

    const errorLink = onError((error) => {
        const { graphQLErrors, networkError } = error;
        if (graphQLErrors) {
            if (graphQLErrors[0].extensions?.code === "MAINTENANCE_MODE") {
                return new Observable((observer) => {
                    observer.complete.bind(observer);

                    if (typeof window !== "undefined") {
                        Router.push(maintenancePagePath);
                    } else {
                        if (res) {
                            res.writeHead(302, {
                                Location: maintenancePagePath
                            });
                            res.end();
                        }
                    }
                });
            }
            if (
                graphQLErrors[0].extensions?.code === "EXPECTED_SERVER_ERROR" ||
                graphQLErrors[0].extensions?.code === "BAD_USER_INPUT"
            ) {
                return new Observable((observer) => {
                    observer.error(error);
                });
            } else {
                // let hasError = false;
                let errorMessage;
                graphQLErrors.map(({ message, locations, path, extensions }) => {
                    if (extensions && extensions.code === "FORBIDDEN") {
                        // Skip FORBIDDEN errors since they're authorization related
                        // Each page should handle the query not having any data
                        // and ideally render PermissionDenied page
                        return;
                    }
                    const errorString = `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
                        locations
                    )}, Path: ${path}`;
                    Sentry.captureException(new Error(errorString));
                    errorMessage = errorString;
                });

                if (errorMessage && typeof window !== "undefined") {
                    throw new Error(errorMessage);
                }
            }
        }
        if (networkError) {
            // @ts-ignore TS2339: Property 'statusCode' does not exist on type 'Error | ServerError | ServerParseError
            if (networkError.statusCode === 429) {
                const redirectTo = "/error?code=429";
                if (typeof window !== "undefined") {
                    // @ts-ignore TS2322: Type '"/app/error?code=429"' is not assignable to type 'Location'.
                    window.location = redirectTo;
                } else if (res) {
                    res.writeHead(301, {
                        Location: redirectTo
                    });
                    res.end();
                }
            }
            // No sentry for this as it could frequently not be our fault?
            console.log(error); // eslint-disable-line no-console
        }
    });

    const link: any = ApolloLink.from([
        loggerLink,
        authLink,
        retryLink,
        errorLink,
        responseLogger,
        timeoutLink,
        // persisted query don't function in serverless env
        // createPersistedQueryLink(),
        splitLink
    ]);

    const defaultOptions: any = {
        watchQuery: {
            fetchPolicy: "cache-first",
            errorPolicy: "ignore"
        },
        query: {
            fetchPolicy: "cache-first",
            errorPolicy: "all",
            partialRefetch: true
        },
        mutate: {
            errorPolicy: "all"
        }
    };

    // The "merge(...) added to disable console warnings when doing optimistic updates.  I believe console warnings will go away when using
    // the new cache.merge() function instead of cache.writeQuery like we are now but I couldn't get cache.merge() to work.
    // The "Query { field { action(existingData, { args, toReference }) } }" is the apollo 3 way to fetch items by id from cache
    // https://deploy-preview-5677--apollo-client-docs.netlify.app/docs/react/v3.0-beta/caching/cache-field-behavior/#merging-arrays
    const cache = new InMemoryCache({
        typePolicies: typePolicies
    }).restore(initialState);

    // Hack for readQuery returning null on empty stuff
    // https://github.com/apollographql/apollo-feature-requests/issues/1#issuecomment-431842138
    /*
  cache.originalReadQuery = cache.readQuery;
  cache.readQuery = (...args) => {
    try {
      return cache.originalReadQuery(...args);
    } catch (err) {
      return undefined;
    }
  };

                                                     */

    // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
    const client = new ApolloClient<any>({
        ssrMode: Boolean(ctx), // Disables forceFetch on the server (so queries are only run once)
        link: link,
        defaultOptions: defaultOptions,
        cache: cache,
        resolvers,
        typeDefs
    });

    // Initialize Cache
    // Without this you get "[Network error]: Invariant Violation: Can't find field version on object undefined."
    // https://www.apollographql.com/docs/react/data/local-state/
    // https://www.apollographql.com/docs/tutorial/local-state/
    // https://blog.tylerbuchea.com/simple-apollo-local-state-example/
    const data = {
        version: {
            backend: "fresh",
            __typename: "Version"
        }
    };

    const initializeCache = (): void => {
        cache.writeQuery({ query: GET_BACKEND_VERSION, data });
    };

    initializeCache();

    client.onResetStore(async () => initializeCache());

    client.onClearStore(async () => initializeCache());

    return client;
}
