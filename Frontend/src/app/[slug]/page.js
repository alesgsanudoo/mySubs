'use client'

import { useState, useEffect } from 'react'
import { PlusCircle, Trash2, DollarSign, Calendar, Package, Settings, User, LogOut, CreditCard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import Image from 'next/image'

const categories = ['Streaming', 'Software', 'Gaming', 'Food', 'Fitness', 'Other']
const paymentCat = ['Card', 'Cash', 'Paypal', 'Apple']

export default function Home(props) {
    const [subscriptions, setSubscriptions] = useState([])
    const [user, setUser] = useState(props.params.slug)
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [payment, setPayment] = useState('')
    const [date, setDate] = useState('')
    const [category, setCategory] = useState('')
    const [billingCycle, setBillingCycle] = useState('monthly')
    const [userSettings, setUserSettings] = useState({
        currency: 'USD',
    })

    const { toast } = useToast()


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

    const addSubscription = async (e) => {
        e.preventDefault()
        if (name && price && date && category) {
            const logo = await fetchLogo(name)
            const nextBillingDate = new Date(date)
            if (billingCycle === 'yearly') {
                nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
            } else {
                nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
            }
            const newSubscription = {
                id: Date.now(),
                name,
                price: parseFloat(price),
                date,
                payment,
                category,
                logo,
                billingCycle,
                nextBillingDate: nextBillingDate.toISOString().split('T')[0]
            }
            setSubscriptions([...subscriptions, newSubscription])
            setName('')
            setPrice('')
            setPayment('')
            setDate('')
            setCategory('')
            setBillingCycle('monthly')
            toast({
                title: "Subscription Added",
                description: `${name} has been added to your subscriptions.`,
            })
        }
    }

    const removeSubscription = (id) => {
        const subscriptionToRemove = subscriptions.find(sub => sub.id === id)
        setSubscriptions(subscriptions.filter(sub => sub.id !== id))
        toast({
            title: "Subscription Removed",
            description: `${subscriptionToRemove?.name} has been removed from your subscriptions.`,
            variant: "destructive",
        })
    }

    const totalMonthly = subscriptions.reduce((sum, sub) => {
        if (sub.billingCycle === 'yearly') {
            return sum + (sub.price / 12)
        }
        return sum + sub.price
    }, 0)

    const totalYearly = subscriptions.reduce((sum, sub) => {
        if (sub.billingCycle === 'monthly') {
            return sum + (sub.price * 12)
        }
        return sum + sub.price
    }, 0)

    const deleteAccount = () => {
        setSubscriptions([])
        setUserSettings({
            currency: 'USD',
        })
        toast({
            title: "Account Deleted",
            description: "Your account and all data have been deleted.",
            variant: "destructive",
        })
    }

    const logout = () => {
        setSubscriptions([])
        setUserSettings({
            currency: 'USD',
        })
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        })
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
                    <Card className="lg:col-span-1 bg-white">
                        <CardHeader>
                            <CardTitle className="text-2xl">Add New Subscription</CardTitle>
                            <CardDescription className="text-gray-500">
                                Enter the details of your new subscription
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={addSubscription} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-700">Subscription Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Netflix, Spotify, etc."
                                        required
                                        className="w-fullbg-white text-gray-900 border-gray-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-gray-700">Price</Label>
                                    <div className="relative">
                                        <DollarSign
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="9.99"
                                            step="0.01"
                                            required
                                            className="pl-10 bg-white text-gray-900 border-gray-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="payment" className="text-gray-700">Payment Method</Label>
                                    <Select value={payment} onValueChange={setPayment} required>
                                        <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                                            <SelectValue placeholder="Select a Payment Method"/>
                                        </SelectTrigger>
                                        <SelectContent className="bg-white text-gray-900 border-gray-300">
                                            {paymentCat.map((pay) => (
                                                <SelectItem key={pay} value={pay}
                                                            className="focus:bg-gray-100">{pay}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-gray-700">First Billing Date</Label>
                                    <div className="relative">
                                        <Calendar
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                            className="pl-10 bg-white text-gray-900 border-gray-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-gray-700">Category</Label>
                                    <Select value={category} onValueChange={setCategory} required>
                                        <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                                            <SelectValue placeholder="Select a category"/>
                                        </SelectTrigger>
                                        <SelectContent className="bg-white text-gray-900 border-gray-300">
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}
                                                            className="focus:bg-gray-100">{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="billingCycle" className="text-gray-700">Billing Cycle</Label>
                                    <Select value={billingCycle} onValueChange={setBillingCycle} required>
                                        <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                                            <SelectValue placeholder="Select billing cycle"/>
                                        </SelectTrigger>
                                        <SelectContent className="bg-white text-gray-900 border-gray-300">
                                            <SelectItem value="monthly"
                                                        className="focus:bg-gray-100">Monthly</SelectItem>
                                            <SelectItem value="yearly" className="focus:bg-gray-100">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                                    <PlusCircle className="mr-2 h-4 w-4"/> Add Subscription
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 bg-white">
                        <CardHeader>
                            <CardTitle className="text-2xl">Your Subscriptions</CardTitle>
                            <CardDescription className="text-gray-500">
                                Manage your active subscriptions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {subscriptions.length === 0 ? (
                                <p className="text-center text-gray-500">No subscriptions added yet.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {subscriptions.map(sub => (
                                        <li key={sub.id}
                                            className="flex items-center justify-between p-4 rounded-lg transition-all hover:bg-gray-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="rounded-full p-2 flex-shrink-0 bg-white">
                                                    {sub.logo ? (
                                                        <Image src={sub.logo} alt={sub.name} width={24} height={24}
                                                               className="rounded-full"/>
                                                    ) : (
                                                        <Package className={"h-6 w-6 text-gray-500"}/>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{sub.name}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        ${sub.price.toFixed(2)} / {sub.billingCycle}
                                                    </p>
                                                    <p className="text-sm text-gray-500">Payment method: {sub.payment}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Next billing: {sub.nextBillingDate}
                                                    </p>
                                                    <span
                                                        className="inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 bg-purple-400 text-gray-700">{sub.category}</span>
                                                </div>
                                            </div>
                                            <Button variant="destructive" size="icon"
                                                    onClick={() => removeSubscription(sub.id)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="mt-6 pt-4 border-tborder-gray-200">
                                <p className="text-xl font-semibold flex items-center justify-between">
                                    Total Monthly:
                                    <span className="text-2xl text-purple-400">${totalMonthly.toFixed(2)}</span>
                                </p>
                                <p className="text-xl font-semibold flex items-center justify-between mt-2">
                                    Total Yearly:
                                    <span className="text-2xl text-purple-400">${totalYearly.toFixed(2)}</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6 bg-white">
                    <CardHeader>
                        <CardTitle className="text-2xl">User Settings</CardTitle>
                        <CardDescription className="text-gray-500">
                            Customize your experience
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="currency"
                                       className={userSettings.darkMode ? "text-gray-300" : "text-gray-700"}>Currency</Label>
                                <Select value={userSettings.currency}
                                        onValueChange={(value) => setUserSettings({...userSettings, currency: value})}>
                                    <SelectTrigger className="w-[180px] bg-white text-gray-900 border-gray-300">
                                        <SelectValue placeholder="Select currency"/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-gray-900 border-gray-300">
                                        <SelectItem value="USD" className="focus:bg-gray-100">USD</SelectItem>
                                        <SelectItem value="EUR" className="focus:bg-gray-100">EUR</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive"
                                            className="w-full mt-4 bg-purple-600 hover:bg-purple-700">Log out</Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white text-gray-900">
                                    <DialogHeader>
                                        <DialogTitle>Are you sure you want to logout?</DialogTitle>
                                        <DialogDescription className="text-gray-500">
                                            You will be logged out, and you will have to log in again.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => {
                                        }}>Cancel</Button>
                                        <Button variant="destructive" onClick={deleteAccount}>Log out</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" className="w-full mt-4">Delete Account</Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white text-gray-900">
                                    <DialogHeader>
                                        <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                                        <DialogDescription className="text-gray-500">
                                            This action cannot be undone. This will permanently delete your account and
                                            remove your data from our servers.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => {
                                        }}>Cancel</Button>
                                        <Button variant="destructive" onClick={deleteAccount}>Delete Account</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
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