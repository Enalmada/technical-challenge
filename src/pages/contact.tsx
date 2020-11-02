import { NextPage } from "next";
import React from "react";

import Layout from "../components/layout/Layout";
import Page from "../components/layout/Page";

const Contact: NextPage = () => {
    return (
        <Layout title={"Contact"}>
            <Page>Contact</Page>
        </Layout>
    );
};

export default Contact;
