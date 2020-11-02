import { NextPage } from "next";
import Error from "next/error";
import React from "react";

const NotFound: NextPage = () => {
    return <Error statusCode={404} />;
};

export default NotFound;
