// pages/api/signup.js
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import validator from "validator";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const {compare} = require("bcrypt");

const signToken = (payload, secret, options) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options, (error, token) => {
            if (error) return reject(error);
            resolve(token);
        })
    })
}

const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, decoded) => {
            if (error) return reject(error);
            resolve(decoded);
        })
    })
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {isLogin, ...userData} = req.body;
        const cookies = req.cookies;
        if (cookies && cookies.LOGIN_INFO) { //Check for token
            try {
                await connectDB()
                const authToken = cookies.LOGIN_INFO;
                const user_session = await Session.findOne({token: authToken});
                if (!user_session) { //User session not found, return null
                    res.setHeader('Set-Cookie', cookie.serialize('LOGIN_INFO', '', {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        expires: new Date(0),
                        sameSite: 'strict',
                        path: '/',
                    }));
                    return res.status(401).json({errorMessage: "Session not found."});
                }
                const findUser = await User.findOne({_id: user_session.userID});
                if (!findUser) { //User not found by ID, return null
                    await Session.deleteOne(user_session);
                    res.setHeader('Set-Cookie', cookie.serialize('LOGIN_INFO', '', {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        expires: new Date(0), // Set the expiration date to a past date
                        sameSite: 'strict',
                        path: '/',
                    }));

                    return res.status(500).json({errorMessage: "User not found..."});
                }

                await verifyToken(authToken, process.env.TOKEN_KEY);
                return res.status(200).json({ //Use found.
                    username: findUser.username,
                    userID: findUser._id.toString(),
                });
            } catch (error) {
                console.log("Auth module: " + error);
                res.status(500).json({errorMessage: "Something went wrong..."});
            }
            return;
        }

        //Routing to Sign up or Sign in
        if (isLogin === 0) { //SignIn
            req.body = userData;
            const {username2, password2} = req.body;
            await handleSignIn(req, res, {username2, password2});
        } else if (isLogin === 1) { //SignUp
            req.body = userData;
            const {name, username, email, password} = req.body;
            await handleSignUp(req, res, {name, username, email, password});
        } else {
            res.status(404).json({errorMessage: "Something went wrong..."});
        }
    } else {
        // Return
        res.setHeader('Allow', ['POST']);
        res.redirect(307, '/error/404')
    }
}

const handleSignIn = async (req, res, {username2, password2}) => {
    try {
        await connectDB()
        if (!username2 || !password2 || username2 === '' || password2 === '') {
            //Check for null fields or empty fields.
            return res.status(400).json({errorMessage: "Empty fields."});
        }

        const findUser = await User.findOne({username: username2.toLowerCase()}); //Find username in the database

        if (findUser === null) { //User does not exist.
            return res.status(401).json({errorMessage: "Invalid credentials."});
        }

        // Compares password given by client and decrypted password stored in MongoDB
        const verifyPassword = await compare(password2, findUser.password);

        if (!verifyPassword) {
            return res.status(401).json({errorMessage: "Invalid credentials."});
        }

        const {cookieConsent} = req.cookies;
        if (cookieConsent === 'accepted' || cookieConsent !== 'rejected') {
            // Create token
            const TOKEN_EXPIRE = 3 * 24 * 60 * 60;
            const token = await signToken(
                {userId: findUser._id}, process.env.TOKEN_KEY,
                {expiresIn: parseInt(TOKEN_EXPIRE, 10)}
            );

            const user_session = await Session.findOne({userID: findUser._id}); // Find session
            if (user_session) { //Check if it does exist the session and update the session
                await Session.findOneAndUpdate({userID: findUser._id}, {token: token}, {new: true});
            } else {
                await Session.create({ // Create session
                    userID: findUser._id.toString(),
                    token: token,
                });
            }

            res.setHeader('Set-Cookie', cookie.serialize('LOGIN_INFO', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: TOKEN_EXPIRE,
                sameSite: 'strict',
                path: '/',
            }));
        }

        return res.status(200).json({ //User Created.
            userID: findUser._id.toString(),
        });
    } catch (e) {
        console.log("Auth module: " + e);
        res.status(500).json({errorMessage: "Something went wrong..."});
    }
}

const handleSignUp = async (req, res, {name, username, email, password}) => {
    try {
        await connectDB()
        if (!name || !username || !email || !password || name === '' || username === '' || email === '' || password === '') {
            //Check for null fields or empty fields.
            return res.status(400).json({errorMessage: "Empty Fields."});
        }

        //Check fields lengths

        if (name.length < 2 || name.length > 10) {
            return res.status(400).json({errorMessage: "Invalid name length. Max (2-15 Chars)."});
        }

        if (username.length < 2 || username.length > 8) {
            return res.status(400).json({errorMessage: "Invalid username length. Max (2-8 Chars)."});
        }

        if (password.length < 4 || password.length > 20) {
            return res.status(400).json({errorMessage: "Invalid password length. Max (4-20 Chars)."});
        }

        //Check email
        if (!validator.isEmail(email)) {
            return res.status(400).json({errorMessage: "Invalid email."});
        }

        const userExists = await User.findOne({
            $or: [{username: username.toLowerCase()}, {email: email.toLowerCase()}]
        });

        if (userExists != null) {
            let errorMessage = "Account already exists.";
            if (userExists.username === username) {
                errorMessage = "Username already exists.";
            } else if (userExists.email === email) {
                errorMessage = "Email already exists.";
            }
            return res.status(409).json({errorMessage: errorMessage});
        }

        const newUser = await User.create({ //Create new user in the MongoDb
            username: username.toLowerCase(),
            name: name.toLowerCase(),
            email: email.toLowerCase(),
            password: password,
        });

        const {cookieConsent} = req.cookies;
        if (cookieConsent === 'accepted' || cookieConsent !== 'rejected') {
            const TOKEN_EXPIRE = 3 * 24 * 60 * 60;
            const token = await signToken(
                {userId: newUser._id.toString()}, process.env.TOKEN_KEY,
                {expiresIn: parseInt(TOKEN_EXPIRE, 10)}
            );

            await Session.create({ // Create session
                userID: newUser._id.toString(),
                token: token,
            });

            res.setHeader('Set-Cookie', cookie.serialize('LOGIN_INFO', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: TOKEN_EXPIRE,
                sameSite: 'strict',
                path: '/',
            }));
        }

        return res.status(200).json({ //User Created.
            userID: newUser._id.toString(),
        });
    } catch (e) {
        console.log("Auth module: " + e);
        res.status(500).json({errorMessage: "Something went wrong..."});
    }
}
