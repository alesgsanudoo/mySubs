'use client'

import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation';
import {Eye, EyeOff, UserRoundPlus, LogIn} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card"
import {useToast} from "@/hooks/use-toast"
import axios from 'axios';
import {Skeleton} from "@/components/ui/skeleton";
import Cookies from 'js-cookie';

const categories = ['Streaming', 'Software', 'Gaming', 'Food', 'Fitness', 'Other']
const paymentCat = ['Card', 'Cash', 'Paypal', 'Apple']

export default function Home() {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [conpassword, setConPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [showPassword2, setShowPassword2] = useState(false)
    const [usernameError2, setUsernameError2] = useState('')
    const [passwordError2, setPasswordError2] = useState('')
    const [username2, setUsername2] = useState('')
    const [password2, setPassword2] = useState('')
    const [isLoading, setLoading] = useState(true);
    const {toast} = useToast()
    const router = useRouter();


    const signUp = async (e) => {
        e.preventDefault()
        setEmailError('')
        setUsernameError('')
        setPasswordError('')
        if (name && email && password && username && conpassword) {
            if (conpassword && password && password !== conpassword) {
                setPasswordError('Passwords do not match.')
                return
            } else {
                setPasswordError('')
            }

            try {
                // Make a POST request to the API route using Axios
                axios.post('/api/auth', {
                    isLogin: 1,
                    name,
                    email,
                    username,
                    password,
                }).then((response) => {
                    const {userID} = response.data;
                    toast({
                        title: "Account Created",
                        description: `${username} welcome to MySubs!`,
                    });
                    setEmail('');
                    setName('');
                    setPassword('');
                    setUsername('');
                    setConPassword('');
                    router.push('/' + userID);

                }).catch((error) => {
                    console.log(error)
                    console.log(error.response);
                    if (error && error.response) {
                        const {status, data} = error.response;
                        console.log("HERE")
                        if (status === 400 || status === 409) { //Wrong syntax or No access
                            if (data.errorMessage.toLowerCase().includes("password")) {
                                setPasswordError(data.errorMessage);
                            } else if (data.errorMessage.toLowerCase().includes("email") && data.errorMessage !== "Invalid email.") {
                                setEmailError(data.errorMessage);
                            } else if (data.errorMessage.toLowerCase().includes("name")
                                && !data.errorMessage.includes("(2-8 Chars)")
                                && data.errorMessage !== "Username already exists.") {
                                setUsernameError(data.errorMessage);
                            } else if (data.errorMessage.toLowerCase().includes("username")) {
                                setUsernameError(data.errorMessage);
                            } else if (data.errorMessage.toLowerCase().includes("email")) {
                                setEmailError(data.errorMessage);
                            }
                        } else {
                            const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again later.";
                            console.error('An error occurred:', error);
                            toast({
                                title: "Error",
                                variant: "destructive",
                                description: errorMessage,
                            });
                        }
                    }
                });
            } catch (error) {
                const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again later.";
                console.error('An error occurred:', error);
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: errorMessage,
                });
            }
        }
    }

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        console.log("TEST")
        console.log(authToken)
        console.log("TEST2");
        axios.post('/api/auth', {
            isLogin: 3,
        }).then((response) => {
            const {userID, username} = response.data;
            toast({
                title: "Welcome Back!",
                description: `You are logged in as ${username}`,
            });
            router.push('/' + userID);
        }).catch((error) => {
            if (error && error.response) {
                const {status, data} = error.response;
                console.error('Error authenticating:', error);
                if (status === 500 || status === 401) {
                    toast({
                        title: "Authentication Error",
                        variant: "destructive",
                        description: "Failed to authenticate. Please log in again.",
                    });
                }
                setLoading(false);
            }
        });
    }, []);

    const signIn = async (e) => {
        e.preventDefault()
        if (password2 && username2) {
            try {
                // Make a POST request to the API route using Axios
                axios.post('/api/auth', {
                    isLogin: 0,
                    username2,
                    password2,
                }).then((response) => {
                    const {userID} = response.data;
                    setPassword2('')
                    setUsername2('')
                    toast({
                        title: "Welcome Back!",
                        description: `You are logged in as ${username2}`,
                    });
                    router.push('/' + userID);
                }).catch((error) => {
                    console.log(error)
                    console.log(error.response);
                    if (error && error.response) {
                        const {status, data} = error.response;
                        console.log("HERE")
                        if (status === 400 || status === 401) { //Wrong syntax or No access
                            setPasswordError2(data.errorMessage);
                            setUsernameError2(data.errorMessage);
                        } else {
                            const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again later.";
                            console.error('An error occurred:', error);
                            toast({
                                title: "Error",
                                variant: "destructive",
                                description: errorMessage,
                            });
                        }
                    }
                });
            } catch (error) {
                const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again later.";
                console.error('An error occurred:', error);
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: errorMessage,
                });
            }
        }
    }


    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <div className="container mx-auto p-4 max-w-6xl">
                {isLoading ? (
                    <Skeleton className="h-10 w-1/2 bg-gradient-to-r from-purple-400 to-pink-400 mb-8"/>
                ) : (
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                            MySubs Tracker
                        </h1>
                    </header>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        {isLoading ? (
                            <Skeleton className="h-80 w-full rounded-lg bg-gray-300"/>
                        ) : (
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Hey there!</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-justify">
                                        Welcome to MySubs Tracker, a webpage I created to keep track of all my
                                        subscriptions since I often forgot the billing dates. This helps me manage my
                                        finances more effectively. While I could have used Excel, I decided to turn it
                                        into a project for one of my CS classes, and it turned out great. I aimed to
                                        make it as secure as possible, and it’s built using Next.js and MongoDB.<br></br><br></br>Alex
                                        S</p>

                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <div className="lg:col-span-2 flex flex-col">
                        {isLoading ? (
                            <Skeleton className="h-80 w-full rounded-lg bg-gray-300"/>
                        ) : (
                            <Card className="bg-white row-span-1">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Sign In</CardTitle>
                                    <CardDescription className="text-gray-500">
                                        Enter your information to log-in an account.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={signIn} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="username2" className="text-gray-700">Username</Label>
                                            <Input
                                                id="username2"
                                                value={username2}
                                                onChange={(e) => setUsername2(e.target.value)}
                                                placeholder="Enter your username"
                                                required
                                                className="w-fullbg-white text-gray-900 border-gray-300"
                                            />
                                            <div className="h-1">
                                                {usernameError2 && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {usernameError2}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password2" className="text-gray-700">Password</Label>
                                            <div className="relative">
                                                {showPassword2 ?
                                                    <Eye onClick={() => {
                                                        setShowPassword2(false)
                                                    }}
                                                         className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                    >

                                                    </Eye> :
                                                    <EyeOff onClick={() => {
                                                        setShowPassword2(true)
                                                    }}
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                    >

                                                    </EyeOff>
                                                }
                                                <Input
                                                    id="password2"
                                                    type={showPassword2 ? 'text' : 'password'}
                                                    value={password2}
                                                    onChange={(e) => setPassword2(e.target.value)}
                                                    placeholder="Enter your Password"
                                                    required
                                                    className="pl-10 bg-white text-gray-900 border-gray-300"
                                                />
                                            </div>
                                            <div className="h-1">
                                                {passwordError2 && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {passwordError2}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Button type="submit"
                                                className="w-full bg-purple-600 hover:bg-purple-700 !mt-8">
                                            <LogIn className="mr-2 h-4 w-4"/> Login into Account
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                        <div className="flex items-center justify-center my-6">
                            <hr className="flex-grow border-t-[1px] border-gray-300"/>
                            <span className="mx-2 text-gray-500">OR</span>
                            <hr className="flex-grow border-t-[1px] border-gray-300"/>
                        </div>
                        {isLoading ? (
                            <Skeleton className="h-80 w-full rounded-lg bg-gray-300"/>
                        ) : (
                            <Card className="bg-white row-span-1">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                                    <CardDescription className="text-gray-500">
                                        Enter your information to create an account.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={signUp} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="username" className="text-gray-700">Username</Label>
                                            <Input
                                                id="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Enter your username"
                                                required
                                                className="w-fullbg-white text-gray-900 border-gray-300"
                                            />
                                            <div className="h-1">
                                                {usernameError && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {usernameError}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-gray-700">Name</Label>
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your name"
                                                required
                                                className="w-fullbg-white text-gray-900 border-gray-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-gray-700">Email</Label>
                                            <Input
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                required
                                                className="w-fullbg-white text-gray-900 border-gray-300"
                                            />
                                            <div className="h-1">
                                                {emailError && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {emailError}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-gray-700">Password</Label>
                                            <div className="relative">
                                                {showPassword ?
                                                    <Eye onClick={() => {
                                                        setShowPassword(false)
                                                    }}
                                                         className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                    >

                                                    </Eye> :
                                                    <EyeOff onClick={() => {
                                                        setShowPassword(true)
                                                    }}
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                    >

                                                    </EyeOff>
                                                }
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Enter your Password"
                                                    required
                                                    className="pl-10 bg-white text-gray-900 border-gray-300"
                                                />
                                            </div>
                                            <div className="h-1">
                                                {passwordError && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {passwordError}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="conpassword" className="text-gray-700">Confirm
                                                Password</Label>
                                            <Input
                                                id="conpassword"
                                                type={showPassword ? 'text' : 'password'}
                                                value={conpassword}
                                                onChange={(e) => setConPassword(e.target.value)}
                                                placeholder="Enter your Password once more"
                                                required
                                                className="w-fullbg-white text-gray-900 border-gray-300"
                                            />
                                            <div className="h-1">
                                                {passwordError && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {passwordError}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Button type="submit"
                                                className="w-full bg-purple-600 hover:bg-purple-700 !mt-8">
                                            <UserRoundPlus className="mr-2 h-4 w-4"/> Create Account
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
                <footer className="flex mb-10 flex-col space-y-2 mt-16 pr-4 pl-4 items-center">
                    <h2 className="text-gray-500">
                        Made with love by <span
                        className="font-bold text-purple-600 hover:text-purple-700">Alex</span> ❤️!
                    </h2>
                    <h2 className="text-gray-500 text-center">
                        Built with <a href="https://nextjs.org/" target="_blank"
                                      className="font-boldtext-purple-600 hover:text-purple-700">NextJS</a>, <a
                        href="https://tailwindcss.com/" target="_blank"
                        className="font-bold text-purple-600 hover:text-purple-700">TailwindCSS</a>,
                        and <a
                        href="https://ui.shadcn.com/" target="_blank"
                        className="font-bold text-purple-600 hover:text-purple-700">shadcn/ui</a>.
                    </h2>
                </footer>
            </div>
        </div>
    )
}