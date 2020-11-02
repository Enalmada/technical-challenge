import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import withPrivateRoute from "src/components/withPrivateRoute";

import Layout from "../../components/layout/app/Layout";
import Page from "../../components/layout/app/Page";
import TaskList from "../../components/tasks/TaskList";
import { getRouteById } from "../../utils/routes";

const Home: NextPage = () => (
    <Layout>
        <Page>
            <div>
                <div className="w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800">
                    Task Manager
                </div>
                <div className="w-full mb-4">
                    <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
                </div>
            </div>

            <div className={"text-center mb-6"}>
                <Link href={getRouteById("NewTask").path}>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center px-20">
                        New Task
                    </button>
                </Link>
            </div>

            <TaskList />
        </Page>
    </Layout>
);

export default withPrivateRoute(Home);
