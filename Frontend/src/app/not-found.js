'use client'


import {Home} from 'lucide-react'
import {Button} from "@/components/ui/button"
import Link from 'next/link'


export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <div className="container mx-auto p-4 max-w-6xl">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                        MySubs Tracker
                    </h1>
                </header>
                <div className="flex flex-col items-center justify-center p-4 min-h-[70vh]">
                    <h1 className="text-8xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                        404
                    </h1>
                    <h2 className="text-3xl font-semibold mb-6 text-purple-700">Page Not Found</h2>
                    <p className="text-xl text-gray-600 text-center mb-8 max-w-md">
                        <strong>Oops!</strong> The page you're looking for doesn't exist or has been moved.
                    </p>
                    <Link href="/" passHref>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white text-lg py-2 px-6">
                            <Home className="mr-2 h-5 w-5"/>
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}