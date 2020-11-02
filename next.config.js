const withOffline = require("next-offline");

const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require("next/constants");

// Use the SentryWebpack plugin to upload the source maps during build step
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const {
    NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
    SENTRY_ORG,
    SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN,
    NODE_ENV,
    VERCEL_GITHUB_COMMIT_SHA,
    VERCEL_GITLAB_COMMIT_SHA,
    VERCEL_BITBUCKET_COMMIT_SHA
} = process.env;

const COMMIT_SHA =
    VERCEL_GITHUB_COMMIT_SHA || VERCEL_GITLAB_COMMIT_SHA || VERCEL_BITBUCKET_COMMIT_SHA;

process.env.SENTRY_DSN = SENTRY_DSN;
const basePath = "";

const sentryWebpackConfig = {
    serverRuntimeConfig: {
        rootDir: __dirname
    }
};

const nextOfflineConfig = {
    transformManifest: (manifest) => ["/"].concat(manifest), // add the homepage to the cache
    // Trying to set NODE_ENV=production when running yarn dev causes a build-time error so we
    // turn on the SW in dev mode so that we can actually test it
    generateInDevMode: false,
    registerSwPrefix: "/api",
    scope: process.env.SW_SCOPE || "/app",
    workboxOpts: {
        swDest: "static/service-worker.js",
        cleanupOutdatedCaches: true,
        // exclude .json for dev test convenience.  Exclude map from being preloaded in prod
        exclude: [
            /build-manifest\.json$/,
            /react-loadable-manifest\.json$/,
            /\.map$/,
            /\.js$/,
            /\.css$/,
            /\.png$/,
            /\.jpg$/,
            /\.webp$/,
            /\.gif$/,
            /\.scss$/,
            /\.svg$/,
            /\.webmanifest$/,
            /\.ico$/,
            /\.txt/
        ],
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
                handler: "CacheFirst",
                options: {
                    cacheName: "google-fonts-stylesheets",
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 60 * 60 * 24 * 30,
                        purgeOnQuotaError: true
                    },
                    cacheableResponse: {
                        statuses: [0, 200]
                    }
                }
            },
            {
                urlPattern: /graphql/,
                handler: "NetworkOnly"
            },
            {
                urlPattern: /^https?.*/,
                handler: "NetworkFirst",
                options: {
                    cacheName: "https-calls",
                    networkTimeoutSeconds: 30,
                    expiration: {
                        maxEntries: 150,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
                        purgeOnQuotaError: true
                    },
                    cacheableResponse: {
                        statuses: [0, 200]
                    }
                }
            }
        ],
        skipWaiting: true,
        clientsClaim: true
    }
};

// Rewriting these to /404 but user still sees original url
// Redirect logic doesn't let you pass 404 as statusCode which is stupid
const notFoundUrls = [];

// We are passing these to redirection and adding no cache headers
const permanentRedirects = [];

// Add no-cache for redirects and some helpful default headers
// TODO: CORS should be specific server rather than wildcard
const headersAndRewrites = {
    async headers() {
        return [
            ...permanentRedirects.map((r) => {
                return {
                    source: r[0],
                    headers: [
                        {
                            key: "Cache-Control",
                            value: "no-store, no-cache"
                        }
                    ]
                };
            }),
            {
                source: "/(.*).js",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*"
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "POST, GET, OPTIONS"
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value:
                            "Origin, X-Requested-With, Content-Type, Accept, Content-Length, X-CSRF-Token, Accept-Version, Content-MD5, Date, X-Api-Version"
                    }
                ]
            },
            {
                source: "/assets/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value:
                            process.env.APP_ENV === "production"
                                ? "public,max-age=30672000,immutable"
                                : "no-store, no-cache, must-revalidate, proxy-revalidate"
                    }
                ]
            },
            {
                source: "/_next/static/images/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public,max-age=30672000,immutable"
                    }
                ]
            },
            {
                source: "/_next/static/(.*)/_buildManifest.js",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public,max-age=30672000,immutable"
                    }
                ]
            },
            {
                source: "/_next/static/(.*)/_buildManifest.js",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public,max-age=30672000,immutable"
                    }
                ]
            },
            {
                source: "/api/service-worker.js",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "no-store, no-cache, must-revalidate, proxy-revalidate"
                    },
                    {
                        key: "Content-Type",
                        value: "application/javascript"
                    },
                    {
                        key: "Service-Worker-Allowed",
                        value: "/"
                    }
                ]
            }
        ];
    },
    async rewrites() {
        return [
            {
                source: "/api/service-worker.js",
                destination: "/_next/static/service-worker.js"
            },
            ...notFoundUrls.map((u) => {
                return {
                    source: u,
                    destination: "/404"
                };
            })
        ];
    },
    async redirects() {
        return [
            ...permanentRedirects.map((r) => {
                return {
                    source: r[0],
                    destination: r[1],
                    permanent: true
                };
            })
        ];
    }
};

const nextConfig = {
    assetPrefix: process.env.ASSET_PREFIX ? process.env.ASSET_PREFIX : "",
    // Setting reactStrictMode:true seems desirable but react-dnd throws errors on SSR
    // https://nextjs.org/blog/next-9-1-7#react-strict-mode-compliance-and-opt-in
    reactStrictMode: false,
    crossOrigin: "anonymous",
    // This goes on only when we are testing serverless deployment
    // target: "serverless",
    poweredByHeader: false,
    onDemandEntries: {
        maxInactiveAge: 1000 * 60 * 60,
        pagesBufferLength: 5
    },
    i18n: {
        // These are all the locales you want to support in
        // your application
        locales: ["en-US"],
        // This is the default locale you want to be used when visiting
        // a non-locale prefixed path e.g. `/hello`
        defaultLocale: "en-US"
    }
};

const allConfig = {
    ...sentryWebpackConfig,
    ...headersAndRewrites,
    ...nextOfflineConfig,
    ...nextConfig,
    webpack: (config, options) => {
        // Fixes npm packages that depend on 'fs' module
        // https://github.com/vercel/next.js/issues/9768#issuecomment-658258230
        if (!options.isServer) {
            config.node = {
                fs: "empty"
            };
        }

        // In `pages/_app.js`, Sentry is imported from @sentry/browser. While
        // @sentry/node will run in a Node.js environment. @sentry/node will use
        // Node.js-only APIs to catch even more unhandled exceptions.
        //
        // This works well when Next.js is SSRing your page on a server with
        // Node.js, but it is not what we want when your client-side bundle is being
        // executed by a browser.
        //
        // Luckily, Next.js will call this webpack function twice, once for the
        // server and once for the client. Read more:
        // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
        //
        // So ask Webpack to replace @sentry/node imports with @sentry/browser when
        // building the browser's bundle
        if (!options.isServer) {
            config.resolve.alias["@sentry/node"] = "@sentry/browser";
        }

        // When all the Sentry configuration env variables are available/configured
        // The Sentry webpack plugin gets pushed to the webpack plugins to build
        // and upload the source maps to sentry.
        // This is an alternative to manually uploading the source maps
        // Note: This is disabled in development mode.
        if (
            SENTRY_DSN &&
            SENTRY_ORG &&
            SENTRY_PROJECT &&
            SENTRY_AUTH_TOKEN &&
            COMMIT_SHA &&
            NODE_ENV === "production"
        ) {
            config.plugins.push(
                new SentryWebpackPlugin({
                    include: ".next",
                    ignore: ["node_modules"],
                    stripPrefix: ["webpack://_N_E/"],
                    urlPrefix: `~${basePath}/_next`,
                    release: COMMIT_SHA
                })
            );
        }

        // TODO: this is only necessary if something is loading moment
        // with moment being deprecated that should go away
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // just load `moment/locale/en.js`
        config.plugins.push(
            new options.webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/)
        );

        // All zones, with a limited date range.  This prunes the timezone file we send to browser
        //const currentYear = new Date().getFullYear();

        /*
    config.plugins.push(
      new MomentTimezoneDataPlugin({
        startYear: currentYear - 2,
        endYear: currentYear + 10
      })
    );

     */

        return config;
    }
};

//  next-less, next-css, etc only need require duing dev/build
// https://github.com/zeit/next.js/issues/4248#issuecomment-386038283
module.exports = (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
        const withSourceMaps = require("@zeit/next-source-maps")();
        const withBundleAnalyzer = require("@next/bundle-analyzer")({
            enabled: process.env.ANALYZE === "true"
        });
        return withOffline(
            withBundleAnalyzer(
                withSourceMaps({
                    ...allConfig
                })
            )
        );
    }
    return withOffline(allConfig);
};
