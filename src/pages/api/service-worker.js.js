const request = require("request");

// WARNING - this file intentionally called .js.js because Next.js strips one of them for the page name
// service-worker.js would map to https://nodabl.co/api/service-worker but we want /api/service-worker.js
// Service worker needs cache, content-type, and Service-Worker-Allowed headers
export default (req, res) => {
    // Request needs full url
    const scriptUrl = process.env.NEXTAUTH_URL + "_next/static/service-worker.js";

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Service-Worker-Allowed", process.env.SW_SCOPE);
    res.statusCode = 200;

    if (process.env.NODE_ENV === "development") {
        res.send(
            "console.info('Service worker disabled for development, will be generated at build time.');"
        );
    } else {
        request.get(scriptUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                // doing some hacks to normalize urls to absolute
                // I am sure this could be done better.
                res.send(
                    body
                        .replace(
                            new RegExp('"url": "_next', "g"),
                            `"url": "${process.env.ASSET_PREFIX}/_next`
                        )
                        .replace(
                            new RegExp('url:"_next', "g"),
                            `url:"${process.env.ASSET_PREFIX}/_next`
                        )
                );
            } else {
                res.statusCode = 500;
                res.send("Error");
            }
        });
    }

    /*
  // Can't read from the file system in AWS serverless
  res.send(
    Buffer.from(
      fs
        .readFileSync("./.next/static/service-worker.js", "utf8")
        .toString()
        .replace(new RegExp('"url": "_next', "g"), '"url": "/_next')
    )
  );

   */
};
