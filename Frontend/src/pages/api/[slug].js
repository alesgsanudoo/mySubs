
import verifyUser from "@/lib/userVerification";
import connectDB from "@/lib/mongodb";
import {calculateNextBillingMonthly, calculateNextBillingYearly} from "@/lib/utils";



export default async function handler(req, res) {
    if (req.method === 'GET') {
        await connectDB()
        const {code, findUser} = await verifyUser(req);
        if (code === 401) {
           return res.status(401).json({errorMessage: "Session not found..."})
        } else if (code === 404) {
            return res.redirect(307, '/error/404')
        } else if (code === 200) {
            const updatedSubscriptions = findUser.subscriptions.map(sub => {
                const subObj = sub.toObject();


                const month = String(subObj.firstBillingDate.getUTCMonth() + 1).padStart(2, '0');
                const day = String(subObj.firstBillingDate.getUTCDate()).padStart(2, '0');
                const year = subObj.firstBillingDate.getUTCFullYear();
                const dateCon = `${year}-${month}-${day}`;

                const nextBillingDate = subObj.billingCycle === 'monthly' ? calculateNextBillingMonthly(dateCon) : calculateNextBillingYearly(dateCon);

                const month2 = String(nextBillingDate.getUTCMonth() + 1).padStart(2, '0');
                const day2 = String(nextBillingDate.getUTCDate()).padStart(2, '0');
                const year2 = nextBillingDate.getUTCFullYear();

                const formattedNextBillingDate = `${month2}-${day2}-${year2}`;

                return {
                    ...subObj,
                    nextBillingString: formattedNextBillingDate,
                };
            });
            return res.status(200).json({subs: updatedSubscriptions});
        }
        return res.status(404).json({errorMessage: "Something went wrong..."});
    } else {
        // Return
        res.setHeader('Allow', ['GET']);
        return res.redirect(307, '/error/404')
    }
}