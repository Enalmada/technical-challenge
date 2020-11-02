import Link from "next/link";
import React from "react";
import withPrivateRoute from "src/components/withPrivateRoute";
import { firebaseClient } from "src/utils/auth/firebaseClient";

// Example of using HOC to protect routes
const Authenticated = () => (
    <div>
        <p>You are logged in.</p>

        <div>
            <Link href={"/"}>
                <a>
                    <button>Index</button>
                </a>
            </Link>
        </div>

        <button
            onClick={async () => {
                await firebaseClient.auth().signOut();
                window.location.href = "/";
            }}>
            Sign out
        </button>
    </div>
);

export default withPrivateRoute(Authenticated);
