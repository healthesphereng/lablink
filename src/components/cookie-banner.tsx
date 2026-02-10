'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'declined');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                    <p>
                        We use cookies to improve your experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
                        Read our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={handleDecline}>
                        Decline
                    </Button>
                    <Button size="sm" onClick={handleAccept} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Accept
                    </Button>
                </div>
            </div>
        </div>
    );
}
