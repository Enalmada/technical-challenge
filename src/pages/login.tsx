import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { firebaseClient } from "src/utils/auth/firebaseClient";
import * as yup from "yup";

import Layout from "../components/layout/Layout";
import { checkUserAuthentication } from "../components/withPrivateRoute";
import { getRouteById } from "../utils/routes";

type FormData = {
    email: string;
    password: string;
};

const schema = yup.object().shape({
    email: yup
        .string()
        .email("Email does not appear to be valid")
        .required("Email is a required field"),
    password: yup
        .string()
        .required("Please enter your password")
        .min(3, "Password must be at least 3 characters")
});

const Login: NextPage = () => {
    const router = useRouter();

    const signUp = ((router.query.signUp as unknown) as string) === "true";

    const { register, handleSubmit, errors, setError } = useForm<FormData>({
        resolver: yupResolver(schema)
    });

    const onSubmit = async ({ email, password }) => {
        try {
            if (signUp) {
                await firebaseClient.auth().createUserWithEmailAndPassword(email, password);
            } else {
                await firebaseClient.auth().signInWithEmailAndPassword(email, password);
            }

            router.push("/app");
        } catch (err) {
            setError("password", {
                type: "manual",
                message: err.message
            });
        }
    };

    return (
        <Layout title={"Login"} empty={true} noindex={true}>
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
                            {signUp ? "Sign up for an account:" : "Sign in to your account:"}
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
                                        {/* errors will return when field validation fails  */}
                                    </div>
                                    {errors.email?.message && (
                                        <span className={"text-red-600"}>
                                            {errors.email?.message}
                                        </span>
                                    )}
                                </div>

                                <div className={"mb-6"}>
                                    <div className="pt-3 rounded bg-gray-200">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                                            htmlFor="password">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            ref={register}
                                            className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
                                        />
                                        {/* errors will return when field validation fails  */}
                                    </div>
                                    {errors.password?.message && (
                                        <span className={"text-red-600"}>
                                            {errors.password?.message}
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <Link href={getRouteById("ForgotPassword").path}>
                                        <a className="text-sm text-purple-600 hover:text-purple-700 hover:underline mb-6">
                                            Forgot your password?
                                        </a>
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 w-full">
                                    {signUp ? "Sign Up" : "Sign In"}
                                </button>
                            </form>

                            <div className={"text-gray-500 mt-5"}>
                                By signing up, you agree to our{" "}
                                <TextLink href={"/terms"}>Terms</TextLink> and{" "}
                                <TextLink href={"/privacy"}>Privacy Policy</TextLink>.
                            </div>
                        </div>
                    </section>
                </main>

                <div className="max-w-lg mx-auto text-center mt-12 mb-6">
                    <p className="text-white">
                        {!signUp ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <Link href={"login?signUp=true"}>
                                    <a className="font-bold hover:underline">Sign up</a>
                                </Link>
                                .
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Link href={getRouteById("Login").path}>
                                    <a className="font-bold hover:underline">Sign in</a>
                                </Link>
                                .
                            </>
                        )}
                    </p>
                </div>

                {/*
            <footer className="max-w-lg mx-auto flex justify-center text-white">
                <Link href={"/contact"}>
                <a href="#" className="hover:underline">
                    Contact
                </a>
                </Link>
                <Link href={"/contact"}>
                <span className="mx-3">•</span>
                <a href="#" className="hover:underline">
                    Privacy
                </a>
                </Link>
            </footer>
            */}
            </div>
        </Layout>
    );
};

const TextLink = (props) => {
    return (
        <Link href={props.href}>
            <button
                className="text-purple-600 hover:text-purple-700 hover:underline background-transparent text-sm outline-none focus:outline-none "
                type="button"
                style={{ transition: "all .15s ease" }}>
                {props.children}
            </button>
        </Link>
    );
};

Login.getInitialProps = async (ctx) => {
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

export default Login;
