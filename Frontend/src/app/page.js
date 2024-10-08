'use client'

import {useState, useEffect} from 'react'
import {Eye, EyeOff, UserRoundPlus, LogIn} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useToast} from "@/hooks/use-toast"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {Switch} from "@/components/ui/switch"
import Image from 'next/image'

const categories = ['Streaming', 'Software', 'Gaming', 'Food', 'Fitness', 'Other']
const paymentCat = ['Card', 'Cash', 'Paypal', 'Apple']

export default function SubscriptionTracker() {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [conpassword, setConPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [usernameError, setUsernameError] = useState('test')
    const [emailError, setEmailError] = useState('test')
    const [showPassword2, setShowPassword2] = useState(false)
    const [usernameError2, setUsernameError2] = useState('')
    const [passwordError2, setPasswordError2] = useState('')
    const [username2, setUsername2] = useState('')
    const [password2, setPassword2] = useState('')

    const {toast} = useToast()

    const signUp = async (e) => {
        e.preventDefault()
        if (name && email && password && username && conpassword) {
            if (conpassword && password && password !== conpassword) {
                setPasswordError('Passwords do not match.')
                return
            } else {
                setPasswordError('')
            }
            setEmail('')
            setName('')
            setPassword('')
            setUsername('')
            setConPassword('')
            toast({
                title: "Account Created",
                variant: "success",
                description: `${username} welcome to MySubs!`,
            })
        }
    }

    const signIn = async (e) => {
        e.preventDefault()
        if (password2 && username2) {
            setPassword2('')
            setUsername2('')
            toast({
                title: "Subscription Added",
                variant: "success",
                description: `${username} welcome again to MySubs!`,
            })
        }
    }


    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <div className="container mx-auto p-4 max-w-6xl">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                        MySubs Tracker
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="text-2xl">Hey there!</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-relaxed">Lorem ipsum odor amet, consectetuer adipiscing elit. Magna nisi semper consectetur
                                    integer velit himenaeos. Tempus urna nam quis natoque nibh tortor pellentesque ad
                                    viverra. Posuere iaculis gravida taciti habitasse diam risus, mauris mauris. Lobortis
                                    quam finibus sed netus nascetur augue cras aliquam. Magna porttitor tempor vehicula
                                    mattis phasellus elementum. Duis sit integer id faucibus convallis, quam curabitur.
                                    Cursus maximus neque elementum ullamcorper tellus. Ornare pretium dapibus sociosqu
                                    nostra massa class fringilla.</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2 flex flex-col">
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
                                        <Label htmlFor="username" className="text-gray-700">Username</Label>
                                        <Input
                                            id="username"
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
                                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 !mt-8">
                                        <LogIn className="mr-2 h-4 w-4"/>  Login into Account
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                        <div className="flex items-center justify-center my-6">
                            <hr className="flex-grow border-t-[1px] border-gray-300"/>
                            <span className="mx-2 text-gray-500">OR</span>
                            <hr className="flex-grow border-t-[1px] border-gray-300"/>
                        </div>
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
                                        <Label htmlFor="conpassword" className="text-gray-700">Confirm Password</Label>
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
                                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 !mt-8">
                                        <UserRoundPlus className="mr-2 h-4 w-4"/> Create Account
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
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