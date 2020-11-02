import Document, { Head, Html, Main, NextScript } from "next/document";

/* tell supportive browsers to start prefetching the DNS for that domain a fraction before it's actually needed.
This means that the DNS lookup process will already be underway by the time the browser hits the script element that actually requests the widget.
It just gives the browser a small head start.
 */
const dnsPrefetch = ["//fonts.googleapis.com"];

/*
By initiating early "preconnects", the browser can set up the necessary sockets ahead of time and eliminate the costly DNS,
TCP, and TLS roundtrips from the critical path of the actual request.
 */
const preConnect = ["https://sentry.io", process.env.ASSET_PREFIX];

/*  Font needs crossorigin https://webmasters.stackexchange.com/a/116629/19891 */
const preConnectAnonymous = ["https://fonts.gstatic.com"];

/*
load woff2 files here to get browser downloading them while it waits for the css that normally loads them
Can't preload google font woff2 as that is dynamic but custom fonts could be appropriate here.
*/
const preLoad = [];

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="en" itemScope itemType="http://schema.org/WebPage">
                <Head>
                    {/* Performance */}
                    {dnsPrefetch.map((name) => (
                        <link rel="dns-prefetch" href={name} key={name} />
                    ))}

                    {preConnect.map((name) => (
                        <link href={name} rel="preconnect" key={name} />
                    ))}
                    {preConnectAnonymous.map((name) => (
                        <link href={name} rel="preconnect" crossOrigin="anonymous" key={name} />
                    ))}

                    {preLoad.map((name) => (
                        <link
                            rel="preload"
                            href={name}
                            as="font"
                            type="font/woff2"
                            crossOrigin="anonymous"
                            key={name}
                        />
                    ))}

                    {/*
                  https://www.filamentgroup.com/lab/load-css-simpler/
                  Note: Next.js _document.js removes onload....had to do some script hack to get onload to work: https://github.com/facebook/react/issues/12014#issuecomment-434534770
                  */}
                    <script
                        dangerouslySetInnerHTML={{
                            __html:
                                '</script><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:wght@400;700&display=swap" media="print" onload="this.media=\'all\'" /><script>'
                        }}
                    />
                </Head>
                <body className={"leading-normal tracking-normal text-white gradient"}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
