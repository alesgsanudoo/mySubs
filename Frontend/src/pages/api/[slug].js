
import verifyUser from "@/lib/userVerification";
import connectDB from "@/lib/mongodb";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        console.log("USER VERIFICATION")
        await connectDB()
        const code = await verifyUser(req);
        if (code === 401) {
           return res.status(401).json({errorMessage: "Session not found..."})
        } else if (code === 404) {
            return res.redirect(307, '/error/404')
        } else if (code === 200) {
            return res.status(200).json({verified: true});
        }
        return res.status(404).json({errorMessage: "Something went wrong..."});
    } else {
        // Return
        res.setHeader('Allow', ['GET']);
        res.redirect(307, '/error/404')
    }
}