import { useApolloClient } from "@apollo/client";
import { NextPage } from "next";
import React, { useEffect } from "react";

import Loader from "../components/Loader";
import { firebaseClient } from "../utils/auth/firebaseClient";
import { getRouteById } from "../utils/routes";

const LogoutRedirect: NextPage = () => {
    const client = useApolloClient();

    useEffect(() => {
        // Remove apollo client cache
        client.clearStore().then(async () => {
            // router.push does preload of javascript chunk which api routes don't have
            // https://stackoverflow.com/a/62788765/1502448
            await firebaseClient.auth().signOut();
            window.location.replace(getRouteById("Index").path);
        });
    }, []);

    return <Loader />;
};

export default LogoutRedirect;
