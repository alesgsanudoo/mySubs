import User from "@/models/User";
import Session from "@/models/Session";
import jwt from "jsonwebtoken";

export default async function verifyUser(req) {
    console.log("USER VERIFICATION")
    const cookies = req.cookies;
    if (req.query && cookies && cookies.LOGIN_INFO) {
        const userID = req.query.slug;
        const authToken = cookies.LOGIN_INFO;
        const tokenUser = jwt.verify(authToken, process.env.TOKEN_KEY);
        if (tokenUser.userId === userID) {
            const user_session = await Session.findOne({token: authToken});
            if (!user_session) { //User session not found, return null
                return 401
            }
            const findUser = await User.findOne({_id: userID});
            if (!findUser) { //User not found by ID, return null
                return 404
            }
            let code = 200
            return {code, findUser};
        }
    }
    return 404
}

