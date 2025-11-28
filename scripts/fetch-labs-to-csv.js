/**
 * Script to fetch medical labs data from Google Places API and export to CSV
 * 
 * Usage:
 * 1. Make sure GOOGLE_PLACES_API_KEY is set in .env.local
 * 2. Run: node scripts/fetch-labs-to-csv.js
 * 
 * This will create a CSV file with all medical labs data
 */

const fs = require('fs');
const path = require('path');

// Configuration
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const OUTPUT_FILE = path.join(__dirname, '..', 'medical_labs_data.csv');

// Location to search (you can modify these)
const SEARCH_LOCATIONS = [
    { city: 'Ikeja', state: 'Lagos' },
    { city: 'Victoria Island', state: 'Lagos' },
    { city: 'Lekki', state: 'Lagos' },
    { city: 'Yaba', state: 'Lagos' },
    { city: 'Surulere', state: 'Lagos' },
    { city: 'Garki', state: 'FCT - Abuja' },
    { city: 'Wuse', state: 'FCT - Abuja' },
    { city: 'Maitama', state: 'FCT - Abuja' },
    { city: 'Port Harcourt', state: 'Rivers' },
    { city: 'Enugu', state: 'Enugu' },
];

async function fetchPlacesForLocation(city, state) {
    const query = `medical laboratory diagnostic center in ${city}, ${state}, Nigeria`;

    console.log(`Fetching labs for ${city}, ${state}...`);

    try {
        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': API_KEY,
                'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.types,places.regularOpeningHours,places.plusCode,places.currentOpeningHours'
            },
            body: JSON.stringify({
                textQuery: query,
                languageCode: 'en',
                maxResultCount: 20,
                locationBias: {
                    circle: {
                        center: {
                            latitude: 9.0820,
                            longitude: 8.6753
                        },
                        radius: 500000.0
                    }
                }
            })
        });

        if (!response.ok) {
            console.error(`Error fetching data for ${city}, ${state}:`, response.status);
            return [];
        }

        const data = await response.json();
        return (data.places || []).map(place => ({
            name: place.displayName?.text || 'N/A',
            address: place.formattedAddress || 'N/A',
            city: city,
            state: state,
            phone: place.nationalPhoneNumber || place.internationalPhoneNumber || 'N/A',
            website: place.websiteUri || 'N/A',
            googleMapsUrl: place.googleMapsUri || 'N/A',
            plusCode: place.plusCode?.globalCode || place.plusCode?.compoundCode || 'N/A',
            rating: place.rating || 'N/A',
            reviewCount: place.userRatingCount || 0,
            latitude: place.location?.latitude || 'N/A',
            longitude: place.location?.longitude || 'N/A',
            openingHours: formatOpeningHours(place.regularOpeningHours || place.currentOpeningHours),
            types: (place.types || []).join('; ')
        }));
    } catch (error) {
        console.error(`Error fetching data for ${city}, ${state}:`, error.message);
        return [];
    }
}

function formatOpeningHours(hours) {
    if (!hours || !hours.weekdayDescriptions) {
        return 'N/A';
    }
    return hours.weekdayDescriptions.join(' | ');
}

function escapeCSV(value) {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
}

function convertToCSV(data) {
    const headers = [
        'Name',
        'Address',
        'City',
        'State',
        'Phone Number',
        'Website',
        'Google Maps URL',
        'Plus Code',
        'Rating',
        'Review Count',
        'Latitude',
        'Longitude',
        'Opening Hours',
        'Types'
    ];

    const csvRows = [headers.join(',')];

    for (const lab of data) {
        const row = [
            escapeCSV(lab.name),
            escapeCSV(lab.address),
            escapeCSV(lab.city),
            escapeCSV(lab.state),
            escapeCSV(lab.phone),
            escapeCSV(lab.website),
            escapeCSV(lab.googleMapsUrl),
            escapeCSV(lab.plusCode),
            escapeCSV(lab.rating),
            escapeCSV(lab.reviewCount),
            escapeCSV(lab.latitude),
            escapeCSV(lab.longitude),
            escapeCSV(lab.openingHours),
            escapeCSV(lab.types)
        ];
        csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
}

async function main() {
    if (!API_KEY) {
        console.error('ERROR: GOOGLE_PLACES_API_KEY not found in environment variables');
        console.error('Please add it to your .env.local file');
        process.exit(1);
    }

    console.log('Starting medical labs data collection...\n');

    const allLabs = [];

    for (const location of SEARCH_LOCATIONS) {
        const labs = await fetchPlacesForLocation(location.city, location.state);
        allLabs.push(...labs);
        console.log(`  Found ${labs.length} labs in ${location.city}, ${location.state}`);

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\nTotal labs collected: ${allLabs.length}`);

    // Remove duplicates based on name and address
    const uniqueLabs = allLabs.filter((lab, index, self) =>
        index === self.findIndex((l) => l.name === lab.name && l.address === lab.address)
    );

    console.log(`Unique labs after deduplication: ${uniqueLabs.length}`);

    // Convert to CSV
    const csv = convertToCSV(uniqueLabs);

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, csv, 'utf8');

    console.log(`\n✅ Data exported successfully to: ${OUTPUT_FILE}`);
    console.log(`📊 Total records: ${uniqueLabs.length}`);
}

// Run the script
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
