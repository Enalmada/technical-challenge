import "assets/styles/index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { DefaultSeo } from "next-seo";
import type { AppProps /*, AppContext */ } from "next/app";
import getConfig from "next/config";
import Router from "next/router";
import { AuthProvider } from "src/utils/auth/auth";

// import your default seo configuration
import SEO from "../../next-seo.config";
import { withApollo } from "../apollo/apollo";

interface AppPropsExtended extends AppProps {
    err: any;
}

// check-types needs this to fix "Property 'analytics' does not exist on type 'Window & typeof globalThis'."
/* eslint-disable */
declare global {
    interface Window {
        __needsReload: boolean;
    }
}
/* eslint-enable */

Router.events.on("routeChangeComplete", () => {
    if (typeof window !== "undefined") {
        if (window.__needsReload) {
            window.__needsReload = false;
            window.location.reload();
        }
    }
});

// https://leerob.io/blog/configuring-sentry-for-nextjs-apps
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const config = getConfig();
    const distDir = `${config.serverRuntimeConfig.rootDir}/.next`;
    Sentry.init({
        enabled: process.env.NODE_ENV === "production",
        integrations: [
            // @ts-ignore
            new RewriteFrames({
                iteratee: (frame) => {
                    frame.filename = frame.filename.replace(distDir, "app:///_next");
                    return frame;
                }
            })
        ],
        environment: process.env.APP_ENV,
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        release: process.env.SENTRY_RELEASE_VERSION,
        beforeSend: (event, hint) => {
            // https://github.com/getsentry/sentry-javascript/issues/1600
            console.error(hint.originalException || hint.syntheticException); // eslint-disable-line no-console
            if (process.env.NODE_ENV === "test") {
                return null; // this drops the event and nothing will be send to sentry
            }

            // keep this line separate to comment it out easily locally to watch errors
            if (process.env.NODE_ENV === "development") {
                return null; // this drops the event and nothing will be send to sentry
            }

            return event;
        }
    });
}

// Use the <Provider> to improve performance and allow components that call
// `useSession()` anywhere in your application to access the `session` object.
const App = ({ Component, pageProps, err }: AppPropsExtended): JSX.Element => {
    return (
        <AuthProvider>
            <DefaultSeo {...SEO} />
            <Component {...pageProps} err={err} />
        </AuthProvider>
    );
};

export default withApollo()(App);
