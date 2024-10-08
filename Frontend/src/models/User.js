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
        concurrency: {//0 USD and 1 EUR
            type: Number,
            default: 0,
            required: [true, 'Concurrency is required'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);

User.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
})


export default mongoose.models.User || mongoose.model("User", User);