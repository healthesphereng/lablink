'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase/provider';
import { doc, getDoc } from 'firebase/firestore';
import { Lab, LabTest } from '@/types';
import { ArrowLeft, MapPin, Phone, Clock, Star, Beaker, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import BookingModal from '@/components/booking-modal';

export default function LabProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { firestore } = useFirebase();
    const [lab, setLab] = useState<Lab | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLab = async () => {
            if (!firestore || !params.labId) return;

            try {
                const labId = Array.isArray(params.labId) ? params.labId[0] : params.labId;
                const docRef = doc(firestore, 'labs', labId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setLab({ id: docSnap.id, ...docSnap.data() } as Lab);
                } else {
                    setError('Lab not found');
                }
            } catch (err) {
                console.error("Error fetching lab:", err);
                setError('Failed to load lab details');
            } finally {
                setLoading(false);
            }
        };

        fetchLab();
    }, [firestore, params.labId]);

    const handleBookClick = (test: LabTest) => {
        setSelectedTest(test);
        setIsBookingOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !lab) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Lab Not Found</h2>
                <p className="text-gray-600 mb-6">{error || "The requested lab could not be found."}</p>
                <Button onClick={() => router.push('/home')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Button
                        variant="ghost"
                        className="mb-6 text-gray-600 hover:text-blue-600 pl-0"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <h1 className="text-3xl font-bold text-gray-900">{lab.name}</h1>
                            {lab.rating && lab.rating > 0 && (
                                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                    <span className="ml-1 font-semibold text-blue-900">{lab.rating}</span>
                                    {lab.reviewCount && lab.reviewCount > 0 && (
                                        <span className="ml-1 text-blue-600 text-sm">({lab.reviewCount} reviews)</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 text-gray-600">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span>{lab.address}</span>
                            </div>
                            {lab.phone && lab.phone !== 'N/A' && (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                        <a href={`tel:${lab.phone}`} className="hover:text-blue-600">{lab.phone}</a>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                        onClick={() => {
                                            const cleanPhone = lab.phone!.replace(/\D/g, '');
                                            const phoneWithCode = cleanPhone.startsWith('234') ? cleanPhone : `234${cleanPhone.replace(/^0/, '')}`;
                                            window.open(`https://wa.me/${phoneWithCode}`, '_blank');
                                        }}
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        WhatsApp
                                    </Button>
                                </div>
                            )}
                            {lab.website && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <a
                                        href={lab.website.startsWith('http') ? lab.website : `https://${lab.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Visit Website
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tests Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="p-6 border-b bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Beaker className="h-5 w-5 text-blue-600" />
                            Available Tests
                        </h2>
                    </div>
                    <div className="divide-y">
                        {lab.tests && lab.tests.length > 0 ? (
                            lab.tests.map((test, index) => (
                                <div key={index} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                    <div>
                                        <Link href={`/tests/${test.testId}`} className="hover:underline">
                                            <h3 className="font-semibold text-blue-900 text-lg">{test.name}</h3>
                                        </Link>
                                        {test.description && (
                                            <p className="text-gray-500 text-sm mt-1">{test.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            onClick={() => handleBookClick(test)}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            Book Test
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No tests listed for this lab yet. Please contact the lab directly for available tests and pricing.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedTest && lab && (
                <BookingModal
                    isOpen={isBookingOpen}
                    onClose={() => setIsBookingOpen(false)}
                    lab={lab}
                    test={selectedTest}
                />
            )}
        </div>
    );
}
