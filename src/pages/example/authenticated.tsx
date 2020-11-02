import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import nookies from "nookies";
import React from "react";
import { firebaseAdmin } from "src/utils/auth/firebaseAdmin";
import { firebaseClient } from "src/utils/auth/firebaseClient";

// Example of server side auth.
// Currently doing the equiv in /api/graphql
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const cookies = nookies.get(ctx);
        const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
        const { uid, email } = token;

        // the user is authenticated!
        // FETCH STUFF HERE

        return {
            props: { message: `Your email is ${email} and your UID is ${uid}.` }
        };
    } catch (err) {
        // either the `token` cookie didn't exist
        // or token verification failed
        // either way: redirect to the login page
        ctx.res.writeHead(302, { Location: "/login" });
        ctx.res.end();
        return { props: {} as never };
    }
};

const Authenticated = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => (
    <div>
        <p>{props.message}</p>
        <button
            onClick={async () => {
                await firebaseClient.auth().signOut();
                window.location.href = "/";
            }}>
            Sign out
        </button>
    </div>
);

export default Authenticated;
