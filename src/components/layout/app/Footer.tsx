import React, { FC } from "react";

interface Props {
    companyName: string;
}

/*
    App footer
 */
const Footer: FC<Props> = (props) => {
    return (
        <footer className="gradient">
            <div className="container mx-auto px-8">
                <div className={"text-white p-2 text-center"}>
                    {" "}
                    © {new Date().getFullYear()} {props.companyName}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
