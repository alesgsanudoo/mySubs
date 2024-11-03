import connectDB from "@/lib/mongodb";
import verifyUser from "@/lib/userVerification";
import mongoose from "mongoose";

const categories = ['Streaming', 'Software', 'Gaming', 'Food', 'Fitness', 'Other'];
const paymentCat = ['Card', 'Cash', 'Paypal', 'Apple'];


export default async function handler(req, res) {
    if (req.method === 'POST') {
        await connectDB();
        const {code, findUser} = await verifyUser(req);
        if (code === 401) {
            return res.status(401).json({errorMessage: "Session not found..."})
        } else if (code === 404) {
            return res.status(404).json({errorMessage: "Request not found."});
        } else if (code === 200) {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const {name, price, date, payment, category, billingCycle} = req.body;
                console.log(req.body)
                if (!name || !price || !payment || !category || !billingCycle) {
                    return res.status(400).json({errorMessage: 'All fields are required.'});
                }


                if (price <= 0) {
                    return res.status(400).json({ errorMessage: 'Invalid price. It must be a positive integer.' });
                }

                if (!categories.includes(category)) {
                    return res.status(400).json({ message: 'Invalid category.' });
                }

                const normalizedPayment = payment.trim().toLowerCase();
                if (!paymentCat.map(p => p.toLowerCase()).includes(normalizedPayment)) {
                    return res.status(400).json({ message: 'Invalid payment method.' });
                }

                if (billingCycle !== 'monthly' && billingCycle === 'early') {
                    return res.status(400).json({errorMessage: 'Incorrect field.'});
                }

                const logo = await fetchLogo(name)

                const firstBillingDate = new Date(date);
                let nextBillingDate;

                if (billingCycle === 'monthly') {
                    nextBillingDate = new Date(firstBillingDate);
                    nextBillingDate.setMonth(firstBillingDate.getMonth() + 1);
                } else if (billingCycle === 'yearly') {
                    nextBillingDate = new Date(firstBillingDate);
                    nextBillingDate.setFullYear(firstBillingDate.getFullYear() + 1);
                }

                const currentDate = new Date();

                if (currentDate >= nextBillingDate) {
                    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

                    if (nextBillingDate.getMonth() === 0) {
                        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
                    }
                }

                const formattedNextBillingDate = `${nextBillingDate.getMonth() + 1} M - ${nextBillingDate.getDate()} D - ${nextBillingDate.getFullYear()} Y`;

                const subscription = {
                    name: name,
                    logo: logo,
                    price: parseFloat(price),
                    firstBillingDate: firstBillingDate,
                    nextBillingDate: nextBillingDate,
                    nextBillingString: formattedNextBillingDate,
                    payment: payment,
                    category: category,
                    billingCycle: billingCycle,
                };

                findUser.subscriptions.push(subscription);

                await findUser.save({ session });

                await session.commitTransaction();
                await session.endSession();
                console.log(subscription)
                return res.status(201).json({sub: findUser.subscriptions});
            } catch (e) {
                await session.abortTransaction();
                console.error('Error adding subscription:', e);
                return res.status(500).json({ message: 'Internal server error' });
            } finally {
                await session.endSession();

            }
        }


    }

}

const fetchLogo = async (companyName) => {
    try {
        const response = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(companyName)}`)
        const data = await response.json()
        console.log(data)
        if (data && data.length > 0) {
            return data[0].logo
        }
    } catch (error) {
        console.error('Error fetching logo:', error)
    }
    return null
}
