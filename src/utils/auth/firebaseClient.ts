import "firebase/auth";

import * as firebaseClient from "firebase/app";

if (typeof window !== "undefined" && !firebaseClient.apps.length) {
    const CLIENT_CONFIG = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_APP_ID
    };

    firebaseClient.initializeApp(CLIENT_CONFIG);

    // JEST testing
    // https://stackoverflow.com/questions/53678410/jest-test-the-current-environment-does-not-support-the-specified-persistence-t
    firebaseClient
        .auth()
        .setPersistence(
            process.env.NODE_ENV === "test"
                ? firebaseClient.auth.Auth.Persistence.NONE
                : firebaseClient.auth.Auth.Persistence.SESSION
        );

    (window as any).firebase = firebaseClient;
}

export { firebaseClient };
