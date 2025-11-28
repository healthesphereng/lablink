import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    if (!city || !state) {
        return NextResponse.json(
            { error: 'City and state are required' },
            { status: 400 }
        );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'Google Places API key not configured' },
            { status: 500 }
        );
    }

    try {
        // Using Google Places API (New) - Text Search
        const query = `medical laboratory diagnostic center in ${city}, ${state}, Nigeria`;

        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.types'
            },
            body: JSON.stringify({
                textQuery: query,
                languageCode: 'en',
                maxResultCount: 20,
                locationBias: {
                    circle: {
                        center: {
                            // Nigeria's approximate center
                            latitude: 9.0820,
                            longitude: 8.6753
                        },
                        radius: 500000.0 // 500km radius
                    }
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Google Places API Error:', errorData);
            return NextResponse.json(
                { error: 'Failed to fetch places from Google' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Transform Google Places data to match our Lab interface
        const labs = (data.places || []).map((place: any) => ({
            id: place.id,
            name: place.displayName?.text || 'Unknown Lab',
            address: place.formattedAddress || '',
            city: city,
            state: state,
            phone: place.nationalPhoneNumber || place.internationalPhoneNumber || 'N/A',
            email: '', // Google Places doesn't provide email
            latitude: place.location?.latitude || 0,
            longitude: place.location?.longitude || 0,
            rating: place.rating || 0,
            reviewCount: place.userRatingCount || 0,
            website: place.websiteUri || '',
            googleMapsUrl: place.googleMapsUri || '',
            types: place.types || [],
            tests: [] // Will be populated separately if needed
        }));

        return NextResponse.json({ labs, count: labs.length });
    } catch (error) {
        console.error('Error fetching places:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
