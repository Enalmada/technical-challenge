export default {
    title: "Technical Challenge",
    titleTemplate: "%s | Technical Challenge",
    description: "Todos are Great. Sign up for free!",
    openGraph: {
        title: "Todos are Great | Technical Challenge",
        description: "Todos are Great. Sign up for free!",
        type: "website",
        locale: "en_US",
        site_name: "Technical Challenge",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/undraw_Checklist__re_2w7v.svg`,
                width: 1200,
                height: 630
            }
        ]
    },
    twitter: {
        site: "@TechnicalChallenge",
        cardType: "summary_large_image"
    },
    facebook: {
        appId: ""
    }
};
