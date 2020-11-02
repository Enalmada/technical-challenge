import { NextPage } from "next";
import React from "react";

import Layout from "../components/layout/Layout";
import Page from "../components/layout/Page";

const FAQ: NextPage = () => {
    return (
        <Layout title={"FAQ"}>
            <Page>
                <h1 className="w-full my-2 text-5xl font-bold leading-tight  text-gray-800">FAQ</h1>
                <div className="w-full mb-4">
                    <div className="h-1 gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
                </div>
            </Page>
        </Layout>
    );
};

export default FAQ;
