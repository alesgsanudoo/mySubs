import verifyUser from "@/lib/userVerification";
import Session from "@/models/Session";
import cookie from "cookie";
import connectDB from "@/lib/mongodb";

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        await connectDB()
        const {code, findUser} = await verifyUser(req);
        if (code === 401) {
            return res.status(401).json({errorMessage: "Session not found..."})
        } else if (code === 404) {
            return res.status(404).json({errorMessage: "Request not found."});
        } else if (code === 200) {
            const cookies = req.cookies;
            const authToken = cookies.LOGIN_INFO;

            const session = await Session.findOne({token: authToken});
            await Session.findByIdAndDelete(session._id.toString());
            res.setHeader('Set-Cookie', cookie.serialize('LOGIN_INFO', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                expires: new Date(0),
                sameSite: 'strict',
                path: '/',
            }));

            return res.status(200).json({done: true});
        } else {
            return res.status(500).json({errorMessage: "Something went wrong..."});
        }
    } else {
        // Return
        res.setHeader('Allow', ['DELETE']);
        res.redirect(307, '/error/404')
    }
}