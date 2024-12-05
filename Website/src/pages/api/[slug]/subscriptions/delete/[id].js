import connectDB from "@/lib/mongodb";
import verifyUser from "@/lib/userVerification";
import mongoose from "mongoose";


export default async function handler(req, res) {
    if (req.method === 'DELETE') {
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
                const {id} = req.query;
                if (!id) {
                    return res.status(400).json({errorMessage: 'All fields are required.'});
                }

                findUser.subscriptions = findUser.subscriptions.filter(subscription => subscription._id.toString() !== id);

                await findUser.save({session});

                await session.commitTransaction();
                await session.endSession();
                return res.status(201).json({sub: findUser.subscriptions});
            } catch (e) {
                await session.abortTransaction();
                console.error('Error adding subscription:', e);
                return res.status(500).json({message: 'Internal server error'});
            } finally {
                await session.endSession();

            }
        }


    }

}



