import Router from "next/router";

/*
    Redirect utility handling both SSR and client side rendering
 */
const redirect = (context, target): void => {
    if (context.res) {
        // server
        // 303: "See other"
        context.res.writeHead(303, { Location: target });
        context.res.end();
    } else {
        // In the browser, we just pretend like this never even happened ;)
        Router.replace(target);
    }
};

export default redirect;
