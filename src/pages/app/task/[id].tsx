import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Layout from "src/components/layout/app/Layout";
import Page from "src/components/layout/app/Page";
import withPrivateRoute from "src/components/withPrivateRoute";

import { useTasksQuery } from "../../../apollo/types/graphql";
import BreadCrumb from "../../../components/Breadcrumb";
import TaskForm from "../../../components/tasks/TaskForm";
import { getRouteById } from "../../../utils/routes";

const Home: NextPage = () => {
    const router = useRouter();

    const id = (router.query.id as unknown) as number;

    const { data, error } = useTasksQuery();

    if (!data) return null;
    if (error) return <div>{`Error! ${error.message}`}</div>;

    const task = data.tasks.find((task) => id == task.id);

    return (
        <Layout>
            <Page>
                <BreadCrumb routes={[getRouteById("Home"), getRouteById("Task")]} />
                <TaskForm task={task} />
            </Page>
        </Layout>
    );
};

export default withPrivateRoute(Home);
