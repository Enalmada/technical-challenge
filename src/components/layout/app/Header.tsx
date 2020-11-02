import Link from "next/link";
import React, { FC, useEffect, useState } from "react";

import { getRouteById } from "../../../utils/routes";

interface Props {
    companyName: string;
}

/*
    App header.
 */
const Header: FC<Props> = (props) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const closedState = {
        header: "",
        navaction: "bg-white text-gray-800",
        toToggle: "text-white",
        navcontent: "bg-gray-200"
    };

    const topOpenState = {
        header: "",
        navaction: "bg-white text-gray-800",
        toToggle: "",
        navcontent: "bg-gray-200 shadow-xl"
    };

    const openState = {
        header: "bg-white shadow",
        navaction: "text-white gradient",
        toToggle: "text-gray-800",
        navcontent: "bg-white"
    };

    const [headerStyle, setHeaderStyle] = useState(closedState);

    // Track if scrolled or not for header colors
    useEffect(() => {
        const onScroll = (e) => {
            const currentScrolled = e.target.documentElement.scrollTop > isScrolled;
            if (isScrolled !== currentScrolled) {
                setIsScrolled(currentScrolled);
            }
        };
        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
    }, [isScrolled]);

    // change menu style when scrolled
    useEffect(() => {
        let shouldBeClasses = closedState;

        if (isScrolled) {
            shouldBeClasses = openState;
        } else {
            if (showMenu) {
                shouldBeClasses = topOpenState;
            }
        }

        if (JSON.stringify(shouldBeClasses) === JSON.stringify(headerStyle)) return;

        setHeaderStyle(shouldBeClasses);
    }, [isScrolled, showMenu]);

    const active = false;
    return (
        <nav id="header" className={`fixed w-full z-30 top-0 text-white ${headerStyle.header}`}>
            <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
                <div className="pl-4 flex items-center">
                    <Link href={getRouteById("Index").path}>
                        <a
                            className={`toggleColour no-underline hover:no-underline font-bold text-2xl lg:text-4xl ${headerStyle.toToggle}`}>
                            {props.companyName}
                        </a>
                    </Link>
                </div>

                <div className="block lg:hidden pr-4">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        id="nav-toggle"
                        className="flex items-center p-1 text-orange-800 hover:text-gray-900">
                        <svg
                            className="fill-current h-6 w-6"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                        </svg>
                    </button>
                </div>

                <div
                    className={`w-full flex-grow lg:flex lg:items-center lg:w-auto lg:block mt-2 lg:mt-0 lg:bg-transparent text-black p-4 lg:p-0 z-20 ${
                        headerStyle.navcontent
                    } ${showMenu ? "" : "hidden"}`}
                    id="nav-content">
                    <ul className="list-reset lg:flex justify-end flex-1 items-center">
                        <li className="mr-3">
                            <Link href={getRouteById("Home").path}>
                                <a
                                    className={`inline-block py-2 px-4 text-black no-underline ${
                                        active
                                            ? "font-bold no-underline"
                                            : "hover:text-gray-800 hover:text-underline"
                                    }`}>
                                    Tasks
                                </a>
                            </Link>
                        </li>
                    </ul>
                    <Link href={getRouteById("Logout").path}>
                        <button
                            id="navAction"
                            className={`mx-auto lg:mx-0 hover:underline font-bold rounded-full mt-4 lg:mt-0 py-4 px-8 shadow opacity-75 ${headerStyle.navaction}`}>
                            Logout
                        </button>
                    </Link>
                </div>
            </div>

            <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
        </nav>
    );
};

export default Header;
