import { ApolloClient, ApolloProvider } from "@apollo/client";
import App from "next/app";
import Head from "next/head";
import React from "react";

// Next.js specific apollo interface.
// Almost exactly from an old Next.js example before it was over simplified
// https://github.com/vercel/next.js/blob/canary/examples/with-apollo/lib/apolloClient.js
// To maintain and upgrade, see the following:
// https://unlyed.github.io/next-right-now/available-presets/v2-mst-aptd-gcms-lcz-sty
// https://graphql-code-generator.com/docs/plugins/typescript-apollo-next
import createApolloClient from "./apolloClient";

// On the client, we store the Apollo Client in the following variable.
// This prevents the client from reinitializing between page transitions.
let globalApolloClient: ApolloClient<any> | null = null;

/**
 * Installs the Apollo Client on NextPageContext
 * or NextAppContext. Useful if you want to use apolloClient
 * inside getStaticProps, getStaticPaths or getServerSideProps
 * @param {NextPageContext | NextAppContext} ctx
 */
export const initOnContext = (ctx: any): any => {
    const inAppContext = Boolean(ctx.ctx);

    // Initialize ApolloClient if not already done
    const apolloClient =
        ctx.apolloClient ||
        initApolloClient(ctx.apolloState || ctx.session || {}, inAppContext ? ctx.ctx : ctx);

    // We send the Apollo Client as a prop to the component to avoid calling initApollo() twice in the server.
    // Otherwise, the component would have to call initApollo() again but this
    // time without the context. Once that happens, the following code will make sure we send
    // the prop as `null` to the browser.
    apolloClient.toJSON = () => null;

    // Add apolloClient to NextPageContext & NextAppContext.
    // This allows us to consume the apolloClient inside our
    // custom `getInitialProps({ apolloClient })`.
    ctx.apolloClient = apolloClient;
    if (inAppContext) {
        ctx.ctx.apolloClient = apolloClient;
    }

    return ctx;
};

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {NormalizedCacheObject} initialState
 * @param  {NextPageContext} ctx
 */
export const initApolloClient = (initialState, ctx): ApolloClient<any> => {
    // Make sure to create a new client for every server-side request so that data
    // isn't shared between connections (which would be bad)
    if (typeof window === "undefined") {
        return createApolloClient(initialState, ctx);
    }

    // Reuse client on the client-side
    if (!globalApolloClient) {
        globalApolloClient = createApolloClient(initialState, ctx);
    }

    return globalApolloClient;
};

/**
 * Creates a withApollo HOC
 * that provides the apolloContext
 * to a next.js Page or AppTree.
 * @param  {Object} withApolloOptions
 * @param  {Boolean} [withApolloOptions.ssr=false]
 * @param  {SessionService} [withApolloOptions.sessionService]
 * @returns {(PageComponent: ReactNode) => ReactNode}
 */
export const withApollo = ({ ssr = true }: any = {}) => (PageComponent) => {
    const WithApollo = ({ apolloClient, apolloState, ...pageProps }): JSX.Element => {
        let client;
        if (apolloClient) {
            // Happens on: getDataFromTree & next.js ssr
            client = apolloClient;
        } else {
            // Happens on: next.js csr
            client = initApolloClient(apolloState, undefined);
        }

        return (
            <ApolloProvider client={client}>
                <PageComponent {...pageProps} apolloClient={client} />
            </ApolloProvider>
        );
    };

    // Set the correct displayName in development
    if (process.env.NODE_ENV !== "production") {
        const displayName = PageComponent.displayName || PageComponent.name || "Component";
        WithApollo.displayName = `withApollo(${displayName})`;
    }

    if (ssr || PageComponent.getInitialProps) {
        WithApollo.getInitialProps = async (ctx) => {
            const inAppContext = Boolean(ctx.ctx);
            const { apolloClient } = initOnContext(ctx);

            // Run wrapped getInitialProps methods
            let pageProps = {};
            if (PageComponent.getInitialProps) {
                pageProps = await PageComponent.getInitialProps(ctx);
            } else if (inAppContext) {
                pageProps = await App.getInitialProps(ctx);
            }

            // Only on the server:
            if (typeof window === "undefined") {
                const { AppTree } = ctx;
                // When redirecting, the response is finished.
                // No point in continuing to render
                if (ctx.res && ctx.res.finished) {
                    return pageProps;
                }

                // Only if dataFromTree is enabled
                if (ssr && AppTree) {
                    try {
                        // Import `@apollo/react-ssr` dynamically.
                        // We don't want to have this in our client bundle.
                        const { getDataFromTree } = await import("@apollo/client/react/ssr");

                        // Since AppComponents and PageComponents have different context types
                        // we need to modify their props a little.
                        let props;
                        if (inAppContext) {
                            props = { ...pageProps, apolloClient };
                        } else {
                            props = { pageProps: { ...pageProps, apolloClient } };
                        }

                        // Take the Next.js AppTree, determine which queries are needed to render,
                        // and fetch them. This method can be pretty slow since it renders
                        // your entire AppTree once for every query. Check out apollo fragments
                        // if you want to reduce the number of rerenders.
                        // https://www.apollographql.com/docs/react/data/fragments/
                        await getDataFromTree(<AppTree {...props} />);
                    } catch (error) {
                        // Prevent Apollo Client GraphQL errors from crashing SSR.
                        // Handle them in components via the data.error prop:
                        // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
                        console.error("Error while running `getDataFromTree`", error); // eslint-disable-line no-console
                    }

                    // getDataFromTree does not call componentWillUnmount
                    // head side effect therefore need to be cleared manually
                    Head.rewind();
                }
            }

            return {
                ...pageProps,
                // Extract query data from the Apollo store
                apolloState: apolloClient.cache.extract(),
                // Provide the client for ssr. As soon as this payload
                // gets JSON.stringified it will remove itself.
                apolloClient: ctx.apolloClient
            };
        };
    }

    return WithApollo;
};
