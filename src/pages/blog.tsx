import { NextPage } from "next";
import React from "react";

import Layout from "../components/layout/Layout";
import Page from "../components/layout/Page";

const Login: NextPage = () => {
    return (
        <Layout title={"Blog"}>
            <Page>Blog</Page>
        </Layout>
    );
};

export default Login;
