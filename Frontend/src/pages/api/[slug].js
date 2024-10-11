import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import validator from "validator";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const cookies = req.cookies;
        if (req.query && cookies && cookies.LOGIN_INFO) {
            const userID = req.query.slug;
            const authToken = cookies.LOGIN_INFO;
            console.log(userID)
            const tokenUser = jwt.verify(authToken, process.env.TOKEN_KEY);
            if (tokenUser.userId === userID) {
                console.log("NOT THE SAME")
                const user_session = await Session.findOne({token: authToken});
                if (!user_session) { //User session not found, return null
                    return res.status(401).json({errorMessage: "Session not found..."});
                }
                const findUser = await User.findOne({_id: userID});
                if (!findUser) { //User not found by ID, return null
                    return res.status(500).json({errorMessage: "User not found..."});
                }
                console.log(findUser)
                return res.status(200).json({done: true});
            }
        }
        return res.status(404).json({errorMessage: "Request not found."});
    } else {
        // Return
        res.setHeader('Allow', ['GET']);
        res.status(405).json({message: `Method ${req.method} not allowed`});
    }
}