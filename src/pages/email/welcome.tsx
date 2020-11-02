import React from "react";

import { useEmailTemplateQuery } from "../../apollo/types/graphql";

const Welcome = () => {
    const { loading, error, data } = useEmailTemplateQuery({
        variables: { template: "test" },
        fetchPolicy: "network-only"
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{`Error! ${error.message}`}</div>;

    // return htmlOutput;

    return (
        <div>
            Email Template
            <div dangerouslySetInnerHTML={{ __html: data.emailTemplate.html }} />
        </div>
    );
};

export default Welcome;
