import { NextPage } from "next";
import React from "react";

import Layout from "../components/layout/Layout";
import Page from "../components/layout/Page";

const Login: NextPage = () => {
    return (
        <Layout title={"About"}>
            <Page>About</Page>
        </Layout>
    );
};

export default Login;
