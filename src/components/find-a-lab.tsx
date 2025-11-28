'use client';

import { useState, useEffect } from 'react';
import { Search, Building2, MapPin, Phone, Clock, Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirebase } from '@/firebase/provider';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Lab } from '@/types';
import Link from 'next/link';

const states = [
    "Abia", "Adamawa", "AkwaIbom", "Anambra", "Bauchi", "Bayelsa",
    "Benue", "Borno", "CrossRiver", "Delta", "Ebonyi", "Edo", "Ekiti",
    "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
    "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun",
    "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
    "Yobe", "Zamfara"
];

const townsByState: Record<string, string[]> = {
    "FCT - Abuja": ["Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa", "Kubwa", "Lugbe", "Jabi", "Utako", "Apo", "Durumi", "Lokogoma", "Galadimawa", "Kabusa"],
    "Lagos": ["Ikeja", "Lekki", "Victoria Island", "Ikoyi", "Yaba", "Surulere", "Maryland"],
    "Rivers": ["Port Harcourt", "Obio-Akpor"],
    "Enugu": ["Enugu", "Nsukka"],
    // Add more as needed
};

export default function FindALab() {
    const { firestore } = useFirebase();
    const [selectedState, setSelectedState] = useState('');
    const [selectedTown, setSelectedTown] = useState('');
    const [availableTowns, setAvailableTowns] = useState<string[]>([]);
    const [labs, setLabs] = useState<Lab[]>([]);
    const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [sortedByDistance, setSortedByDistance] = useState(false);

    useEffect(() => {
        if (selectedState && townsByState[selectedState]) {
            setAvailableTowns(townsByState[selectedState]);
            setSelectedTown('');
        } else {
            setAvailableTowns([]);
            setSelectedTown('');
        }
    }, [selectedState]);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = labs.filter(lab =>
                lab.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredLabs(filtered);
        } else {
            setFilteredLabs(labs);
        }
    }, [searchQuery, labs]);

    const handleSearch = async () => {
        if (!selectedState) {
            setError('Please select a state');
            return;
        }

        setLoading(true);
        setError('');
        setSortedByDistance(false); // Reset distance sorting flag

        try {
            if (!firestore) {
                setError('Firebase not initialized');
                return;
            }

            const labsRef = collection(firestore, 'labs');
            let q;

            if (selectedTown) {
                // Query by both state and city
                q = query(
                    labsRef,
                    where('state', '==', selectedState),
                    where('city', '==', selectedTown)
                );
            } else {
                // Query by state only
                q = query(labsRef, where('state', '==', selectedState));
            }

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setLabs([]);
                setError(`No labs found in ${selectedTown || selectedState}`);
            } else {
                const fetchedLabs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Lab));
                setLabs(fetchedLabs);
            }
        } catch (err) {
            console.error('Error fetching labs:', err);
            setError('Failed to load labs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Haversine formula to calculate distance in km
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    };

    const deg2rad = (deg: number): number => {
        return deg * (Math.PI / 180);
    };

    const handleNearMe = async () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        setError('');
        setSortedByDistance(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });

                try {
                    if (!firestore) {
                        setError('Firebase not initialized');
                        return;
                    }

                    // Fetch all labs
                    const labsRef = collection(firestore, 'labs');
                    const snapshot = await getDocs(labsRef);

                    if (snapshot.empty) {
                        setLabs([]);
                        setError('No labs found');
                    } else {
                        const fetchedLabs = snapshot.docs.map(doc => {
                            const labData = { id: doc.id, ...doc.data() } as Lab;
                            const distance = calculateDistance(
                                latitude,
                                longitude,
                                labData.latitude,
                                labData.longitude
                            );
                            return { ...labData, distance };
                        });

                        // Sort by distance and take only the 10 closest labs
                        const sortedLabs = fetchedLabs
                            .sort((a, b) => (a.distance || 0) - (b.distance || 0))
                            .slice(0, 10); // Only show 10 nearest labs
                        setLabs(sortedLabs);
                    }
                } catch (err) {
                    console.error('Error fetching nearby labs:', err);
                    setError('Failed to load nearby labs. Please try again.');
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                setError('Unable to retrieve your location. Please enable location access and try again.');
                setLoading(false);
            }
        );
    };

    const getWhatsAppLink = (phone: string) => {
        // Remove all non-numeric characters
        const cleanPhone = phone.replace(/\D/g, '');
        // Add Nigeria country code if not present
        const phoneWithCode = cleanPhone.startsWith('234') ? cleanPhone : `234${cleanPhone.replace(/^0/, '')}`;
        return `https://wa.me/${phoneWithCode}`;
    };

    return (
        <>
            {/* Search Section */}
            <div className="bg-white flex flex-col rounded-lg shadow-lg p-6 mb-8">
                {/* Text Search */}
                <div className="mb-6">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">Search by Lab Name</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            id="search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type lab name to filter results..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mx-auto">
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <select
                            id="state"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a state</option>
                            {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-2">Town/City</label>
                        <select
                            id="town"
                            value={selectedTown}
                            onChange={(e) => setSelectedTown(e.target.value)}
                            disabled={!selectedState || availableTowns.length === 0}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">All towns (optional)</option>
                            {availableTowns.map(town => (
                                <option key={town} value={town}>{town}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={handleSearch}
                        disabled={!selectedState || loading}
                        className="flex-1 max-w-md flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <Search className="h-5 w-5" />
                        {loading && !sortedByDistance ? 'Searching...' : 'Find Labs'}
                    </Button>
                    <Button
                        onClick={handleNearMe}
                        disabled={loading}
                        variant="outline"
                        className="flex-1 max-w-md flex items-center justify-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                        <MapPin className="h-5 w-5" />
                        {loading && sortedByDistance ? 'Finding...' : 'Near Me'}
                    </Button>
                </div>
            </div>

            {/* Results Section */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {filteredLabs.length > 0 && (
                <>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {sortedByDistance
                                ? `Found ${filteredLabs.length} nearest lab${filteredLabs.length !== 1 ? 's' : ''} to your location`
                                : `Found ${filteredLabs.length} lab${filteredLabs.length !== 1 ? 's' : ''} ${searchQuery ? `matching "${searchQuery}"` : `in ${selectedTown || selectedState}`}`
                            }
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLabs.map(lab => (
                            <div key={lab.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 flex-1 pr-2">{lab.name}</h3>
                                        <div className="flex flex-col gap-2 items-end">
                                            {lab.rating && lab.rating > 0 && (
                                                <div className="flex items-center bg-blue-50 px-2 py-1 rounded text-sm font-semibold text-blue-700">
                                                    <Star className="w-4 h-4 mr-1 fill-current" />
                                                    {lab.rating}
                                                </div>
                                            )}
                                            {lab.distance !== undefined && (
                                                <div className="flex items-center bg-green-50 px-2 py-1 rounded text-xs font-semibold text-green-700">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {lab.distance.toFixed(1)} km
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-start gap-2 text-gray-600">
                                            <MapPin className="w-[18px] h-[18px] mt-1 flex-shrink-0" />
                                            <p className="text-sm">{lab.address}</p>
                                        </div>
                                        {lab.phone && lab.phone !== 'N/A' && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="w-[18px] h-[18px]" />
                                                <p className="text-sm">{lab.phone}</p>
                                            </div>
                                        )}
                                        {lab.website && (
                                            <div className="flex items-center gap-2 text-blue-600">
                                                <Building2 className="w-[18px] h-[18px]" />
                                                <a
                                                    href={lab.website.startsWith('http') ? lab.website : `https://${lab.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm hover:underline"
                                                >
                                                    Visit Website
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t">
                                        <Link href={`/labs/${lab.id}`} className="flex-1">
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                                View Details
                                            </Button>
                                        </Link>
                                        {lab.phone && lab.phone !== 'N/A' && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    className="px-3"
                                                    onClick={() => window.open(`tel:${lab.phone}`, '_self')}
                                                    title="Call"
                                                >
                                                    <Phone className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="px-3 text-green-600 border-green-600 hover:bg-green-50"
                                                    onClick={() => window.open(getWhatsAppLink(lab.phone!), '_blank')}
                                                    title="WhatsApp"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {!loading && filteredLabs.length === 0 && !error && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg mb-2">
                        {labs.length > 0 ? 'No labs match your search' : 'Select a state and click "Find Labs" to search'}
                    </p>
                    <p className="text-gray-400 text-sm">
                        {labs.length > 0 ? 'Try a different search term' : 'We have labs available across Nigeria'}
                    </p>
                </div>
            )}
        </>
    );
}
