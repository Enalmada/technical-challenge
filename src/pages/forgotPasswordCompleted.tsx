import { NextPage } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React from "react";

import Layout from "../components/layout/Layout";
import { checkUserAuthentication } from "../components/withPrivateRoute";
import { getRouteById } from "../utils/routes";

const ForgotPasswordCompleted: NextPage = () => {
    const router = useRouter();

    return (
        <Layout title={"Forgot Password"} empty={true} noindex={true}>
            <div className={"body-bg min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0"}>
                <header className="max-w-lg mx-auto">
                    <Link href={getRouteById("Index").path}>
                        <a>
                            <h1 className="text-4xl font-bold text-white text-center">
                                Technical Challenge
                            </h1>
                        </a>
                    </Link>
                </header>

                <main className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
                    <section>
                        <div className="flex flex-col">
                            <div className={"text-black"}>
                                If an account with this email exists, we will send a forgot password
                                link via email.
                            </div>

                            <button
                                onClick={async () => {
                                    await router.push("/login");
                                }}
                                className="mt-10 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200">
                                Return To Login
                            </button>
                        </div>
                    </section>
                </main>

                <div className="max-w-lg mx-auto text-center mt-12 mb-6">
                    <p className="text-white">
                        Don&apos;t have an account?{" "}
                        <Link href={"login?signUp=true"}>
                            <a className="font-bold hover:underline">Sign up</a>
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </Layout>
    );
};

ForgotPasswordCompleted.getInitialProps = async (ctx) => {
    const userAuth = await checkUserAuthentication(ctx);

    const location = "/app";

    // User is already logged in
    if (userAuth?.auth) {
        // Handle server-side and client-side rendering.
        if (ctx.res) {
            ctx.res?.writeHead(302, {
                Location: location
            });
            ctx.res?.end();
        } else {
            await Router.replace(location);
        }
    }

    return {};
};

export default ForgotPasswordCompleted;
