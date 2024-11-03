
import verifyUser from "@/lib/userVerification";
import connectDB from "@/lib/mongodb";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        console.log("USER VERIFICATION")
        await connectDB()
        const {code, findUser} = await verifyUser(req);
        if (code === 401) {
           return res.status(401).json({errorMessage: "Session not found..."})
        } else if (code === 404) {
            return res.redirect(307, '/error/404')
        } else if (code === 200) {
            const currentDate = new Date();
            const updatedSubscriptions = findUser.subscriptions.map(sub => {
                const subObj = sub.toObject();
                const nextBillingDate = new Date(subObj.nextBillingDate);

                if (currentDate >= nextBillingDate) {
                    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

                    if (nextBillingDate.getMonth() === 0) {
                        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
                    }
                }

                const formattedNextBillingDate = `${nextBillingDate.getMonth() + 1}-${nextBillingDate.getDate()}-${nextBillingDate.getFullYear()}`;

                return {
                    ...subObj,
                    nextBillingString: formattedNextBillingDate,
                };
            });
            console.log(updatedSubscriptions)
            return res.status(200).json({subs: updatedSubscriptions});
        }
        return res.status(404).json({errorMessage: "Something went wrong..."});
    } else {
        // Return
        res.setHeader('Allow', ['GET']);
        return res.redirect(307, '/error/404')
    }
}