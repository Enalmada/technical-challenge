import Router from "next/router";
import nookies from "nookies";
import React from "react";

const login = "/login"; // Define your login route address.

/**
 * Check user authentication and authorization
 * template: https://github.com/vercel/next.js/discussions/10925
 * @returns {{auth: null}}
 */
export const checkUserAuthentication = async (ctx) => {
    // Firebase will throw error so redirect to login in that case
    try {
        const cookies = nookies.get(ctx);

        // Currently checking token on backend with every graphql request
        // so HOC just assumes for now that having a cookie means logged in
        // const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/auth')
        // const json = await res.json()

        if (!cookies?.token) {
            return {};
        }

        return { auth: true };
    } catch (err) {
        return {};
    }
};

// Most of this is from examples but made current with functional components
// https://medium.com/@eslamifard.ali/how-to-simply-create-a-private-route-in-next-js-38cab204a99c
const withPrivateRoute = (WrappedComponent) => {
    const FuncComponent = ({ children, ...props }) => {
        // Example for where we would do useEffect if we wanted it on every page
        // useEffect(() => { });

        return <WrappedComponent {...props}>{children}</WrappedComponent>;
    };

    FuncComponent.getInitialProps = async (ctx) => {
        // If Page/Component has a `getInitialProps`, we should call it.
        const props =
            WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

        const userAuth = await checkUserAuthentication(ctx);

        // Are you an authorized user or not?
        if (!userAuth?.auth) {
            // Handle server-side and client-side rendering.
            if (ctx.res) {
                ctx.res?.writeHead(302, {
                    Location: login
                });
                ctx.res?.end();
            } else {
                await Router.replace(login);
            }
        } else if (WrappedComponent.getInitialProps) {
            const wrappedProps = await WrappedComponent.getInitialProps(userAuth);
            return { ...wrappedProps, userAuth };
        }

        return { ...props, userAuth };
    };

    return FuncComponent;
};

export default withPrivateRoute;
