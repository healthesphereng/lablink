/**
 * Script to populate Firestore with Abuja medical labs data
 * Run with: node scripts/populate-abuja-labs.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc } = require('firebase/firestore');

// Firebase configuration (from your existing config)
const firebaseConfig = {
    apiKey: "AIzaSyDGEgwuDTKUZQVxdEPTFMVqjUqMpZZWLxM",
    authDomain: "studio-109280062-71202.firebaseapp.com",
    projectId: "studio-109280062-71202",
    storageBucket: "studio-109280062-71202.firebasestorage.app",
    messagingSenderId: "1095008859088",
    appId: "1:1095008859088:web:b1c6e9f0a0e8e0e0e0e0e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Abuja labs data
const abujaLabs = [
    {
        name: "Epiconsult Clinic & Diagnostics Centre",
        rating: 4.3,
        type: "Medical laboratory",
        address: "Zone 3, 33 Abidjan St, Wuse, Abuja, 900281, Federal Capital Territory",
        phone: "0703 576 5000",
        website: "epidiagnostics.com",
        plusCode: "3F5C+FQ Abuja",
        city: "Wuse",
        state: "FCT - Abuja"
    },
    {
        name: "PIUSMAR MED-LAB SERVICES LIMITED CHIKA",
        rating: 3.3,
        type: "Medical laboratory",
        address: "Airport Rd, Lugbe 900107, Federal Capital Territory",
        phone: "0915 017 5598",
        website: "",
        plusCode: "XCV4+4X Lugbe",
        city: "Lugbe",
        state: "FCT - Abuja"
    },
    {
        name: "PABARA medical laboratory and diagnostic centre, LTD",
        rating: 5.0,
        type: "Medical laboratory",
        address: "Suite 13, Manhattan mall, 2 4th Ave, Gwarinpa Estate, Abuja 900108, Federal Capital Territory",
        phone: "0901 140 4480",
        website: "",
        plusCode: "4C85+WQ Abuja",
        city: "Gwarinpa",
        state: "FCT - Abuja"
    },
    {
        name: "Healthquest Medical Laboratory",
        rating: 4.7,
        type: "Medical laboratory",
        address: "X9MC+H57, Lugbe 900107, Federal Capital Territory",
        phone: "0816 025 7401",
        website: "",
        plusCode: "",
        city: "Lugbe",
        state: "FCT - Abuja"
    },
    {
        name: "Health Premial Laboratory",
        rating: 5.0,
        type: "Laboratory",
        address: "Funab mall No 1, Road, 11 1st Avenue, Local, Gwarinpa, Abuja 900108, Federal Capital Territory",
        phone: "0813 580 2448",
        website: "healthpremial.com.ng",
        plusCode: "3CQ5+WM Abuja",
        city: "Gwarinpa",
        state: "FCT - Abuja"
    },
    {
        name: "Maxi-care Medical Diagnostic Laboratories LTD",
        rating: 5.0,
        type: "Local medical services",
        address: "6th avenue, Gwarinpa Abuja, Majia Plaza, Saraha Estate, Gwarinpa, Abuja, Federal Capital Territory",
        phone: "0703 733 3986",
        website: "",
        plusCode: "494C+5W Abuja",
        city: "Gwarinpa",
        state: "FCT - Abuja"
    },
    {
        name: "Shalom Medical Centre",
        rating: 3.0,
        type: "Medical laboratory",
        address: "Suite C22, Bensima House, Aguiyi Ironsi St, behind National Boundary Commission, Maitama, Abuja 904101, Federal Capital Territory",
        phone: "0803 622 4817",
        website: "",
        plusCode: "3FMJ+QR Abuja",
        city: "Maitama",
        state: "FCT - Abuja"
    },
    {
        name: "Eureka medical lab",
        rating: 5.0,
        type: "Medical laboratory",
        address: "29 3rd Ave, Gwarinpa, Abuja 900108, Federal Capital Territory",
        phone: "",
        website: "",
        plusCode: "",
        city: "Gwarinpa",
        state: "FCT - Abuja"
    },
    {
        name: "Alive Medical Laboratory And diagnostics",
        rating: 5.0,
        type: "Diagnostic center",
        address: "XC4V+GCV, beside salmana filling station, Kabusa 900107, Federal Capital Territory",
        phone: "0703 979 5740",
        website: "",
        plusCode: "",
        city: "Kabusa",
        state: "FCT - Abuja"
    },
    {
        name: "OBA-MEDS DIAGNOSTIC SERVICES",
        rating: 5.0,
        type: "Medical laboratory",
        address: "Global Plaza, Jabi, Abuja 900108, Federal Capital Territory",
        phone: "0708 544 6629",
        website: "obamedslab.com.ng",
        plusCode: "3C7F+J5 Abuja",
        city: "Jabi",
        state: "FCT - Abuja"
    },
    {
        name: "Echolab Radiology & Laboratory Services, Wuse",
        rating: 3.4,
        type: "Diagnostic center",
        address: "Sigma Apartments, 11 Embu, Wuse 2, Abuja 904101, Federal Capital Territory",
        phone: "0906 025 6665",
        website: "",
        plusCode: "3FHC+GG Abuja",
        city: "Wuse",
        state: "FCT - Abuja"
    },
    {
        name: "Achievers Diagnostic Centre",
        rating: null,
        type: "Medical laboratory",
        address: "Suite 2B Sabondale Shopping Complex, Obafemi Awolowo Way, Jabi, Abuja, FCT",
        phone: "0803 621 9727",
        website: "",
        plusCode: "3C69+48 Abuja",
        city: "Jabi",
        state: "FCT - Abuja"
    },
    {
        name: "EHA Clinics Lab Collection Abuja - Asokoro",
        rating: 4.2,
        type: "Laboratory",
        address: "296 Jesse Jackson St, Asokoro, Abuja 900103, Federal Capital Territory",
        phone: "",
        website: "eha.ng",
        plusCode: "2GW6+G5 Abuja",
        city: "Asokoro",
        state: "FCT - Abuja"
    },
    {
        name: "Fastgate Diagnostic Laboratory",
        rating: 4.0,
        type: "Medical laboratory",
        address: "Suit 4, 1st Floor, 10Q Plaza, by Polaris/Union Bank, Pa Michael Imoudu Ave, Gwarinpa, Floor 1 · Providence Plaza",
        phone: "0909 291 4554",
        website: "",
        plusCode: "3CX5+FP Gwarinpa",
        city: "Gwarinpa",
        state: "FCT - Abuja"
    },
    {
        name: "Nugal Diagnostics",
        rating: null,
        type: "Medical laboratory",
        address: "Zone 5, Suite 13, Dee Awwal Plaza, Michael Okpara St",
        phone: "0805 514 1328",
        website: "",
        plusCode: "",
        city: "Abuja",
        state: "FCT - Abuja"
    },
    {
        name: "GRACE DIAGNOSTIC LABORATORIES",
        rating: 3.0,
        type: "Medical laboratory",
        address: "Shop 16, Malili plaza Aldenco estate, Galadimawa Galadimawa Abuja - FCT",
        phone: "",
        website: "",
        plusCode: "",
        city: "Galadimawa",
        state: "FCT - Abuja"
    },
    {
        name: "Maocare Medical Laboratories",
        rating: null,
        type: "Medical laboratory",
        address: "Suite 5 uturu plaza opposite red Cross headquarters by TOs Benson crescent utako Utakoh strict, Abuja 900211, Federal Capital Territory",
        phone: "0902 671 1947",
        website: "",
        plusCode: "",
        city: "Utako",
        state: "FCT - Abuja"
    },
    {
        name: "Jogna Medical Consult And Diagnostics",
        rating: 5.0,
        type: "Medical laboratory",
        address: "Plot No. 495 Cadastral Zone 13, Tefcon Plaza, Gaduwa District, Lokogoma, 900107, Federal Capital Territory",
        phone: "0806 556 3280",
        website: "jognadiagnostics.org",
        plusCode: "",
        city: "Lokogoma",
        state: "FCT - Abuja"
    },
    {
        name: "Omega Medical Labouratory",
        rating: 3.0,
        type: "Medical laboratory",
        address: "C23, Besima House ,opp maitama general hospital, behind maitama boundry commission, Wuse, Abuja, Fct 904101, Federal Capital Territory",
        phone: "0803 643 4431",
        website: "",
        plusCode: "",
        city: "Wuse",
        state: "FCT - Abuja"
    },
    {
        name: "Nero Medical Diagnostic Laboratory",
        rating: 4.7,
        type: "Medical laboratory",
        address: "2922+6RV, Lugbe 900107, Federal Capital Territory",
        phone: "0902 053 0693",
        website: "",
        plusCode: "",
        city: "Lugbe",
        state: "FCT - Abuja"
    },
    {
        name: "CBSC MEDICAL LABORATORY CENTRE",
        rating: 5.0,
        type: "Medical laboratory",
        address: "KABAKI PLAZA SUITE 308, PLOT 941, JAHI, Abuja 900108, Federal Capital Territory",
        phone: "0805 788 1953",
        website: "cbscmedicals.com",
        plusCode: "",
        city: "Jahi",
        state: "FCT - Abuja"
    },
    {
        name: "Body Affairs Diagnostics Limited",
        rating: 4.8,
        type: "Diagnostic center",
        address: "Hajjar's Place, 6, 1349 Ahmadu Bello Wy, Garki II, Abuja",
        phone: "0814 309 8100",
        website: "bodyaffairs.com.ng",
        plusCode: "",
        city: "Garki",
        state: "FCT - Abuja"
    },
    {
        name: "CentoLab",
        rating: 4.9,
        type: "Laboratory",
        address: "63 Ebitu Ukiwe St, Utako, Abuja 900108, Federal Capital Territory",
        phone: "0905 555 0513",
        website: "centolab.ng",
        plusCode: "",
        city: "Utako",
        state: "FCT - Abuja"
    },
    {
        name: "Labcrest Medical Diagnostic and Clinic Ltd Garki branch",
        rating: 5.0,
        type: "Medical clinic",
        address: "Suite 002, Grey Plaza, Opp. NNPC Quarters, Dunukofia St, Garki, Abuja 900103, Federal Capital Territory",
        phone: "0814 250 6148",
        website: "",
        plusCode: "",
        city: "Garki",
        state: "FCT - Abuja"
    },
    {
        name: "OBA-MEDS Laboratory",
        rating: 4.8,
        type: "Medical laboratory",
        address: "Phase 3 No, 23 Bayelsa Rd, Trademore Estate, Lugbe 900107, Federal Capital Territory",
        phone: "0807 688 8696",
        website: "obamedslab.com.ng",
        plusCode: "",
        city: "Lugbe",
        state: "FCT - Abuja"
    },
    {
        name: "Boraxe Diagnostics LTD",
        rating: 4.5,
        type: "Medical laboratory",
        address: "FHA, Lugbe Plaza Abuja, opposite AMAC Market, Lugbe 900001, Federal Capital Territory",
        phone: "0705 508 2941",
        website: "boraxediagnostics.com",
        plusCode: "",
        city: "Lugbe",
        state: "FCT - Abuja"
    },
    {
        name: "Medical Microbiology and Parasitology Department, NHA",
        rating: null,
        type: "Laboratory",
        address: "Plot 132 Central Business District Phase II, Garki, Abuja 900241, Federal Capital Territory",
        phone: "0912 271 8191",
        website: "nationalhospital.gov.ng",
        plusCode: "",
        city: "Garki",
        state: "FCT - Abuja"
    },
    {
        name: "Zeda Medical Diagnostics Ltd",
        rating: 5.0,
        type: "Medical laboratory",
        address: "1 Blantyre Cres, Wuse 2, Abuja 900288, Federal Capital Territory",
        phone: "0902 233 4406",
        website: "zedamedicals.com",
        plusCode: "",
        city: "Wuse",
        state: "FCT - Abuja"
    },
    {
        name: "Everight Diagnostic And Laboratory Services Limited (Abuja)",
        rating: 4.2,
        type: "Medical diagnostic imaging center",
        address: "2 FEZ STREET, OFF Kumasi Cres, Wuse 2, Federal Capital Territory",
        phone: "0815 551 5100",
        website: "everightlab.com",
        plusCode: "",
        city: "Wuse",
        state: "FCT - Abuja"
    },
    {
        name: "Ojonimi Medical Laboratory",
        rating: 5.0,
        type: "Medical laboratory",
        address: "321 Road, Off 3rd Ave, Cornershop",
        phone: "0807 999 9756",
        website: "",
        plusCode: "",
        city: "Abuja",
        state: "FCT - Abuja"
    },
    {
        name: "Buffers Medical Diagnostics Laboratory",
        rating: 5.0,
        type: "Diagnostic center",
        address: "Abuja 900107, Federal Capital Territory",
        phone: "",
        website: "",
        plusCode: "",
        city: "Abuja",
        state: "FCT - Abuja"
    },
    {
        name: "Clina Lancet Laboratories (Gudu)",
        rating: null,
        type: "Medical laboratory",
        address: "2 Sam Mbakwe St, Apo, Abuja 900104, Federal Capital Territory",
        phone: "0201 700 1310",
        website: "cerbalancetafrica.ng",
        plusCode: "",
        city: "Apo",
        state: "FCT - Abuja"
    },
    {
        name: "Omega Medical Laboratory and Scan Center Ltd",
        rating: null,
        type: "Medical laboratory",
        address: "NIPCO FILLING Plaza, Banex Junction, By, off Aminu Kano Crescent, Wuse II, Abuja 900108, Federal Capital Territory",
        phone: "0818 387 5164",
        website: "",
        plusCode: "",
        city: "Wuse",
        state: "FCT - Abuja"
    },
    {
        name: "Bio-Gene Diagnostic Laboratory & Scan Utako",
        rating: null,
        type: "Medical laboratory",
        address: "Suite 04, Gouba Plaza, beside Chicken Republic, Utako, AMAC 900108, Federal Capital Territory",
        phone: "0913 754 2628",
        website: "bio-genediagnostics.com",
        plusCode: "3C8V+J3 Abuja",
        city: "Utako",
        state: "FCT - Abuja"
    },
    {
        name: "Tonia Medical Diagnostic Services",
        rating: 4.0,
        type: "Medical laboratory",
        address: "Suite 02, along BAnex/Next, The Capital Hub, Ahmadu Bello Wy, Mabushi, Wuse 900021, Federal Capital Territory",
        phone: "0909 748 6557",
        website: "",
        plusCode: "3FQ2+V2 Wuse",
        city: "Wuse",
        state: "FCT - Abuja"
    },
    {
        name: "Sonia Medical Laboratory and Diagnostics (Gwarinpa, Abuja)",
        rating: 5.0,
        type: "Medical laboratory",
        address: "6th Ave, Gwarinpa, Abuja 900108, Federal Capital Territory",
        phone: "0703 330 8636",
        website: "",
        plusCode: "496G+3V Abuja",
        city: "Gwarinpa",
        state: "FCT - Abuja"
    },
    {
        name: "Omega Medical Laboatories",
        rating: 3.0,
        type: "Medical laboratory",
        address: "Suite Elite Shopping Complex, 21 Aduwa Close, Off Tufashiya Crescent, Abuja",
        phone: "0803 431 2350",
        website: "",
        plusCode: "39GW+JQ Abuja",
        city: "Abuja",
        state: "FCT - Abuja"
    },
    {
        name: "MEDIK HEALTH CLINIC AND DIAGNOSTICS, LTD",
        rating: 4.6,
        type: "Diagnostic center",
        address: "No:40, Mike Akhigbe Wy, Jabi, District 900001, Federal Capital Territory",
        phone: "0707 229 4437",
        website: "medikhcd.com",
        plusCode: "3CCH+QH Abuja",
        city: "Jabi",
        state: "FCT - Abuja"
    },
    {
        name: "DNA Labs & Clinics",
        rating: 4.4,
        type: "Medical laboratory",
        address: "2 Ajayi Crowther St, Asokoro, Aso 900103, Federal Capital Territory",
        phone: "0906 704 8152",
        website: "dnalabs.com.ng",
        plusCode: "3G2G+MG Aso",
        city: "Asokoro",
        state: "FCT - Abuja"
    },
    {
        name: "Impressions 'N Teeth ltd",
        rating: 4.7,
        type: "Dental laboratory",
        address: "VIO Office, Fct, Plot 711 Sentinel Cres, Emeka Epuna Cl, behind Area 1, Durumi, Abuja 900001, Federal Capital Territory",
        phone: "0708 878 8880",
        website: "",
        plusCode: "2FH6+XM Abuja",
        city: "Durumi",
        state: "FCT - Abuja"
    },
    {
        name: "Cedarcrest Molecular Lab",
        rating: 4.3,
        type: "Laboratory",
        address: "No. 10 Sheik Ismaila Idris Street, 131 Road, 1st Avenue, Gwarinpa",
        phone: "0908 771 3514",
        website: "cedarcresthospitals.com",
        plusCode: "3CV7+GQ Gwarinpa",
        city: "Gwarinpa",
        state: "FCT - Abuja"
    },
    {
        name: "Sivors Laboratory",
        rating: 5.0,
        type: "Medical laboratory",
        address: "1a Taraba Cres, Maitama, AMAC 900271, Federal Capital Territory",
        phone: "0813 934 9006",
        website: "",
        plusCode: "",
        city: "Maitama",
        state: "FCT - Abuja"
    },
    {
        name: "Taymic Medical Laboratory and Diagnostic center",
        rating: 5.0,
        type: "Medical laboratory",
        address: "PalmHeights plaza VON Road, off Airport Rd, Sabon Lugbe, Abuja 900107",
        phone: "0909 060 7161",
        website: "",
        plusCode: "",
        city: "Lugbe",
        state: "FCT - Abuja"
    },
    {
        name: "Otess Medical Laboratory",
        rating: 5.0,
        type: "Medical laboratory",
        address: "Total corner shop, Lugbe 900107, Federal Capital Territory",
        phone: "0810 974 6692",
        website: "",
        plusCode: "",
        city: "Lugbe",
        state: "FCT - Abuja"
    },
    {
        name: "Biocrown Diagnostics Limited",
        rating: 5.0,
        type: "Medical laboratory",
        address: "Suite B3, Apo Sunrise Plaza, Apo Resettlement, Apo, AMAC, Abuja 900104, Federal Capital Territory",
        phone: "0908 892 3404",
        website: "",
        plusCode: "XFPX+R9 Abuja",
        city: "Apo",
        state: "FCT - Abuja"
    }
];

// Function to extract coordinates from Plus Code (simplified - you may need Google's API for accurate conversion)
function getPlusCodeCoordinates(plusCode) {
    // This is a simplified placeholder - in production, use Google's Plus Codes API
    // For now, we'll use Abuja's approximate center
    return {
        latitude: 9.0765,
        longitude: 7.3986
    };
}

async function populateAbujaLabs() {
    try {
        console.log('Starting to populate Abuja labs...\n');

        // Optional: Clear existing Abuja labs
        console.log('Checking for existing labs...');
        const labsRef = collection(db, 'labs');
        const snapshot = await getDocs(labsRef);

        let deletedCount = 0;
        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (data.state === 'FCT - Abuja') {
                await deleteDoc(doc.ref);
                deletedCount++;
            }
        }
        console.log(`Deleted ${deletedCount} existing Abuja labs\n`);

        // Add new labs
        let addedCount = 0;
        for (const lab of abujaLabs) {
            const coords = lab.plusCode ? getPlusCodeCoordinates(lab.plusCode) : { latitude: 9.0765, longitude: 7.3986 };

            const labData = {
                name: lab.name,
                address: lab.address,
                city: lab.city,
                state: lab.state,
                phone: lab.phone || 'N/A',
                email: '',
                website: lab.website ? `https://${lab.website}` : '',
                latitude: coords.latitude,
                longitude: coords.longitude,
                rating: lab.rating || 0,
                reviewCount: 0,
                plusCode: lab.plusCode || '',
                types: [lab.type],
                description: `${lab.type} located in ${lab.city}, Abuja`,
                isOpen: true,
                tests: []
            };

            await addDoc(labsRef, labData);
            addedCount++;
            console.log(`✓ Added: ${lab.name}`);
        }

        console.log(`\n✅ Successfully added ${addedCount} Abuja labs to Firestore!`);
        console.log('You can now view them in your Find a Lab page.');

    } catch (error) {
        console.error('Error populating labs:', error);
    }
}

// Run the script
populateAbujaLabs()
    .then(() => {
        console.log('\n✨ Script completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
