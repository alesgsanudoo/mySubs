import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const User = mongoose.Schema({
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        subscriptions: [{
            name: {
                type: String,
                required: [true, 'Name of subscription is required'],
            },
            logo: {
                type: String,
                required: [true, 'logo of subscription is required'],
            },
            price: {
                type: Number,
                required: true,
            },
            firstBillingDate: {
                type: Date,
                required: [true, 'First billing date is required'],
            },
            nextBillingString: {
                type: String,
                required: [true, 'Next billing date is required'],
            },
            billingCycle: {
                type: String,
                required: [true, 'Billing of subscription is required'],
            },
            payment: {
                type: String,
                required: [true, 'Payment method of subscription is required'],
            },
            category: {
                type: String,
                required: [true, 'Category of subscription is required'],
            },
        }]

    }
);

User.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
})


export default mongoose.models.User || mongoose.model("User", User);