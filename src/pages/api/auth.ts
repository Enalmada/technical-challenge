import { firebaseAdmin } from "src/utils/auth/firebaseAdmin";

// Currently unused.  Checking auth in /api/graphql
// Keeping this here for future reference
const AuthApi = async (req, res) => {
    const cookieToken = req.cookies.token;

    try {
        if (!cookieToken) {
            return res.status(401).send("You are unauthorised");
        }
        const token = await firebaseAdmin.auth().verifyIdToken(cookieToken);
        const { uid, email } = token;

        return res.status(200).json({
            uid,
            email
        });
    } catch (error) {
        return res.status(401).send("You are unauthorised");
    }
};

export default AuthApi;
