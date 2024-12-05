'use client';

import {useState, useEffect} from 'react';
import {Button} from "@/components/ui/button";
import Cookies from 'js-cookie';

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = Cookies.get('cookieConsent');
        if (!consent) {
            setShowBanner(false);
        }
    }, []);

    const handleAccept = () => {
        Cookies.set('cookieConsent', 'accepted', {expires: 365});
        setShowBanner(false);
    };

    const handleReject = () => {
        Cookies.set('cookieConsent', 'rejected', {expires: 365});
        setShowBanner(false);
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div
            className="fixed bottom-0 md:bottom-3 lg:bottom-3 xl:bottom-3 left-1/2 transform -translate-x-1/2 w-full max-w-xl sm:max-w-md md:max-w-xl p-4 bg-gray-800 text-white sm:rounded-none md:shadow-lg md:rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 space-x-4 sm:space-y-0">
                <p className="text-justify sm:text-left text-sm">
                    We use cookies to enhance your experience. By accepting, you agree to our cookie policy. (Cookies in
                    this case are only used to ensure you are logged in)
                </p>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                    <Button onClick={handleReject} variant="destructive" className="text-sm">
                        Reject
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-sm" onClick={handleAccept}
                            variant="default">
                        Accept
                    </Button>
                </div>
            </div>
        </div>
    );
}
