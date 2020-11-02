import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Layout from "../components/layout/Layout";
import { checkUserAuthentication } from "../components/withPrivateRoute";
import { firebaseClient } from "../utils/auth/firebaseClient";
import { getRouteById } from "../utils/routes";

type FormData = {
    email: string;
};

const schema = yup.object().shape({
    email: yup
        .string()
        .email("Email does not appear to be valid")
        .required("Email is a required field")
});

const ForgotPassword: NextPage = () => {
    const router = useRouter();

    const { register, handleSubmit, errors, setError } = useForm<FormData>({
        resolver: yupResolver(schema)
    });

    const onSubmit = async ({ email }) => {
        try {
            await firebaseClient.auth().sendPasswordResetEmail(email);

            router.push("/app");
        } catch (err) {
            setError("email", {
                type: "manual",
                message: err.message
            });
        }

        await router.push("/forgotPasswordCompleted");
    };

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
                        {/* <h3 className="text-black font-bold text-2xl">Welcome</h3> */}
                        <p className="text-gray-600 pt-2">
                            What email did you forget the password to?
                        </p>
                    </section>

                    <section className="mt-10">
                        <div className="flex flex-col">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={"mb-6"}>
                                    <div className="pt-3 rounded bg-gray-200">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                                            htmlFor="email">
                                            Email
                                        </label>

                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            ref={register}
                                            className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
                                        />
                                    </div>
                                    {errors.email?.message && (
                                        <span className={"text-red-600"}>
                                            {errors.email?.message}
                                        </span>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 w-full">
                                    Submit
                                </button>
                            </form>
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

ForgotPassword.getInitialProps = async (ctx) => {
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

export default ForgotPassword;
