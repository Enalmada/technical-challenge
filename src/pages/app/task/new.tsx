import { NextPage } from "next";
//import { useRouter } from "next/router";
import React from "react";
import BreadCrumb from "src/components/Breadcrumb";
import Layout from "src/components/layout/app/Layout";
import Page from "src/components/layout/app/Page";
import withPrivateRoute from "src/components/withPrivateRoute";

import TaskForm from "../../../components/tasks/TaskForm";
import { getRouteById } from "../../../utils/routes";

const NewTask: NextPage = () => {
    //const router = useRouter();

    return (
        <Layout>
            <Page>
                <BreadCrumb routes={[getRouteById("Home"), getRouteById("NewTask")]} />
                <TaskForm />
            </Page>
        </Layout>
    );
};

export default withPrivateRoute(NewTask);
