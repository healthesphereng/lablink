import { collection, getDocs, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { Lab } from '@/types';

// Helper to generate a random offset for coordinates to prevent stacking
const getOffset = () => (Math.random() - 0.5) * 0.01;

const SAMPLE_LABS: Omit<Lab, 'id'>[] = [
    // --- ABIA ---
    {
        name: "Abia State Specialist Hospital Diagnostic Centre",
        address: "Umu Obasi, Umuahia, Abia",
        description: "State-owned specialist hospital offering comprehensive diagnostic services.",
        latitude: 5.5260 + getOffset(),
        longitude: 7.4898 + getOffset(),
        isOpen: true,
        rating: 4.2,
        tests: [
            { name: "Malaria Parasite", price: 1500, description: "Microscopy" },
            { name: "Widal Test", price: 2000, description: "Typhoid screening" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "e-Clinic & Diagnostics",
        address: "7 Factory Road, Aba, Abia",
        description: "Modern diagnostic facility in the commercial hub of Aba.",
        latitude: 5.1066 + getOffset(),
        longitude: 7.3667 + getOffset(),
        isOpen: true,
        rating: 4.5,
        tests: [
            { name: "Ultrasound", price: 4000, description: "Abdominal scan" },
            { name: "X-Ray", price: 3500, description: "Chest X-Ray" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
    },

    // --- ADAMAWA ---
    {
        name: "Fombina Medical Diagnostic Center",
        address: "Furore Road, By Mbamba, Yola South, Adamawa",
        description: "Leading diagnostic center in Yola.",
        latitude: 9.2035 + getOffset(),
        longitude: 12.4954 + getOffset(),
        isOpen: true,
        rating: 4.4,
        tests: [
            { name: "Full Blood Count", price: 2500, description: "Hematology" },
            { name: "Urinalysis", price: 1000, description: "Urine test" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800"
    },

    // --- AKWA IBOM ---
    {
        name: "Image Diagnostics",
        address: "No. 4, Obio Imoh Street, Off Aka Road, Uyo, Akwa Ibom",
        description: "Specialized imaging and diagnostic services.",
        latitude: 5.0377 + getOffset(),
        longitude: 7.9128 + getOffset(),
        isOpen: true,
        rating: 4.6,
        tests: [
            { name: "CT Scan", price: 45000, description: "Computed Tomography" },
            { name: "MRI", price: 80000, description: "Magnetic Resonance Imaging" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a092fc4b?auto=format&fit=crop&q=80&w=800"
    },

    // --- ANAMBRA ---
    {
        name: "Jenneric Medical Laboratory",
        address: "21 Meloch Avenue, Ifite Awka, Anambra",
        description: "Reliable medical laboratory services in Awka.",
        latitude: 6.2209 + getOffset(),
        longitude: 7.0679 + getOffset(),
        isOpen: true,
        rating: 4.3,
        tests: [
            { name: "Genotype", price: 2000, description: "Hb electrophoresis" },
            { name: "Blood Group", price: 1000, description: "ABO/Rh" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1579165466741-7f35e4755652?auto=format&fit=crop&q=80&w=800"
    },

    // --- BAUCHI ---
    {
        name: "Al Manzoor Diagnostic Clinical Services",
        address: "10 Rijiyan Bauchi Street, Off Ibo Road, Bauchi",
        description: "Comprehensive clinical diagnostic services.",
        latitude: 10.3103 + getOffset(),
        longitude: 9.8439 + getOffset(),
        isOpen: true,
        rating: 4.1,
        tests: [
            { name: "Liver Function Test", price: 5000, description: "LFT Panel" },
            { name: "Kidney Function Test", price: 6000, description: "E/U/Cr" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800"
    },

    // --- BAYELSA ---
    {
        name: "Bayelsa Diagnostics Centre",
        address: "500 Bed Medical Centre, Ingbi Road, Yenagoa, Bayelsa",
        description: "State-of-the-art diagnostic facility.",
        latitude: 4.9267 + getOffset(),
        longitude: 6.2636 + getOffset(),
        isOpen: true,
        rating: 4.5,
        tests: [
            { name: "Mammogram", price: 12000, description: "Breast screening" },
            { name: "Ultrasound", price: 4000, description: "General scan" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1516574187841-69301976e499?auto=format&fit=crop&q=80&w=800"
    },

    // --- BENUE ---
    {
        name: "WinAboyi Medical & Diagnostic Centre",
        address: "20 Vandeikya Street, High Level, Makurdi, Benue",
        description: "Trusted medical and diagnostic center in Makurdi.",
        latitude: 7.7411 + getOffset(),
        longitude: 8.5121 + getOffset(),
        isOpen: true,
        rating: 4.3,
        tests: [
            { name: "Hepatitis B Surface Ag", price: 2500, description: "Viral screening" },
            { name: "HIV Screening", price: 2000, description: "Retroviral test" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800"
    },

    // --- BORNO ---
    {
        name: "Union Diagnostic & Clinical Services",
        address: "Kumshe Ward, Maiduguri, Borno",
        description: "Branch of the nationwide diagnostic network.",
        latitude: 11.8311 + getOffset(),
        longitude: 13.1510 + getOffset(),
        isOpen: true,
        rating: 4.0,
        tests: [
            { name: "X-Ray", price: 4000, description: "Digital Radiography" },
            { name: "ECG", price: 3000, description: "Electrocardiogram" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
    },

    // --- CROSS RIVER ---
    {
        name: "ASI Ukpo Diagnostic & Medical Centre",
        address: "Mary Slessor Avenue, Calabar, Cross River",
        description: "Premier diagnostic center in Calabar.",
        latitude: 4.9508 + getOffset(),
        longitude: 8.3250 + getOffset(),
        isOpen: true,
        rating: 4.7,
        tests: [
            { name: "CT Scan", price: 55000, description: "Advanced imaging" },
            { name: "Endoscopy", price: 30000, description: "Internal examination" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
    },

    // --- DELTA ---
    {
        name: "Kome Tiens Diagnostic Centre",
        address: "Ken Plaza 229 Jakpa Road Effurun, Warri, Delta",
        description: "Diagnostic and treatment center in Warri.",
        latitude: 5.5544 + getOffset(),
        longitude: 5.7932 + getOffset(),
        isOpen: true,
        rating: 4.4,
        tests: [
            { name: "Ultrasound", price: 3500, description: "Scan" },
            { name: "Lab Tests", price: 5000, description: "General pathology" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
    },

    // --- EBONYI ---
    {
        name: "Lifecare Medical Diagnostics",
        address: "28A Water Works Road, Azuiyi Udene, Abakaliki, Ebonyi",
        description: "Quality diagnostic services in Abakaliki.",
        latitude: 6.3249 + getOffset(),
        longitude: 8.1137 + getOffset(),
        isOpen: true,
        rating: 4.2,
        tests: [
            { name: "Microscopy", price: 1500, description: "Parasitology" },
            { name: "Chemistry", price: 4000, description: "Blood chemistry" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
    },

    // --- EDO ---
    {
        name: "Scantrik Diagnostics",
        address: "21 Adesuwa Grammar School Rd, GRA, Benin City, Edo",
        description: "Advanced diagnostic center in Benin City.",
        latitude: 6.3350 + getOffset(),
        longitude: 5.6037 + getOffset(),
        isOpen: true,
        rating: 4.6,
        tests: [
            { name: "4D Ultrasound", price: 10000, description: "High def scan" },
            { name: "Echocardiogram", price: 25000, description: "Heart scan" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800"
    },

    // --- EKITI ---
    {
        name: "Union Diagnostic & Clinical Services",
        address: "68 University Teaching Hospital Road, Ado-Ekiti, Ekiti",
        description: "Reliable diagnostics in Ado-Ekiti.",
        latitude: 7.6212 + getOffset(),
        longitude: 5.2194 + getOffset(),
        isOpen: true,
        rating: 4.1,
        tests: [
            { name: "X-Ray", price: 3000, description: "Plain film" },
            { name: "Lab Tests", price: 2000, description: "Routine labs" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a092fc4b?auto=format&fit=crop&q=80&w=800"
    },

    // --- ENUGU ---
    {
        name: "Lifechart Medical Diagnostic Services",
        address: "1B Ozor-Nwokeabia Street, Trans-Ekulu, Enugu",
        description: "Comprehensive medical diagnostics.",
        latitude: 6.4281 + getOffset(),
        longitude: 7.4963 + getOffset(),
        isOpen: true,
        rating: 4.5,
        tests: [
            { name: "Full Body Check", price: 30000, description: "Wellness package" },
            { name: "Hormonal Assay", price: 18000, description: "Fertility profile" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1579165466741-7f35e4755652?auto=format&fit=crop&q=80&w=800"
    },

    // --- FCT - ABUJA ---
    {
        name: "Synlab Nigeria (Abuja)",
        address: "17 Aminu Kano Cres, Wuse 2, Abuja",
        description: "Premium diagnostic services in the heart of Abuja.",
        latitude: 9.0765 + getOffset(),
        longitude: 7.4780 + getOffset(),
        isOpen: true,
        rating: 4.8,
        tests: [
            { name: "Executive Checkup", price: 95000, description: "Full body analysis" },
            { name: "Hormone Profile", price: 25000, description: "Fertility and wellness" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Medicaid Radio-diagnostics",
        address: "Plot 1195, Aminu Kano Cres, Wuse II, Abuja",
        description: "Leading center for radiology and laboratory services.",
        latitude: 9.0780 + getOffset(),
        longitude: 7.4750 + getOffset(),
        isOpen: true,
        rating: 4.6,
        tests: [
            { name: "MRI Brain", price: 90000, description: "Neurological imaging" },
            { name: "Digital X-Ray", price: 6000, description: "Chest/Bone imaging" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1516574187841-69301976e499?auto=format&fit=crop&q=80&w=800"
    },

    // --- GOMBE ---
    {
        name: "Al Ihsan Medical Clinic and Diagnosis",
        address: "Legislative Quarters, Jekadafari, Gombe",
        description: "Medical clinic with diagnostic services.",
        latitude: 10.2897 + getOffset(),
        longitude: 11.1673 + getOffset(),
        isOpen: true,
        rating: 4.0,
        tests: [
            { name: "Ultrasound", price: 3000, description: "Scan" },
            { name: "Lab Tests", price: 2000, description: "Routine" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800"
    },

    // --- IMO ---
    {
        name: "Nucleus Biomedical Diagnostic Centre",
        address: "No 3 Nekede-Ihiagwa Road, Owerri, Imo",
        description: "Biomedical diagnostics and research.",
        latitude: 5.4891 + getOffset(),
        longitude: 7.0176 + getOffset(),
        isOpen: true,
        rating: 4.3,
        tests: [
            { name: "DNA Test", price: 60000, description: "Paternity testing" },
            { name: "Microbiology", price: 5000, description: "Culture & Sensitivity" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
    },

    // --- JIGAWA ---
    {
        name: "Albarka Clinic & Diagnostics",
        address: "Government House Road, Dutse, Jigawa",
        description: "Clinic offering laboratory and imaging services.",
        latitude: 11.7594 + getOffset(),
        longitude: 9.3392 + getOffset(),
        isOpen: true,
        rating: 4.0,
        tests: [
            { name: "Malaria Test", price: 1000, description: "RDT/Microscopy" },
            { name: "Widal", price: 1500, description: "Typhoid" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
    },

    // --- KADUNA ---
    {
        name: "DNA Labs",
        address: "No. Q5 Danja Road, Off Katuru Road, Unguwar Sarki, Kaduna",
        description: "Specialized molecular diagnostics laboratory.",
        latitude: 10.5105 + getOffset(),
        longitude: 7.4165 + getOffset(),
        isOpen: true,
        rating: 4.7,
        tests: [
            { name: "PCR Analysis", price: 35000, description: "Molecular testing" },
            { name: "Genetic Testing", price: 50000, description: "Hereditary screening" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
    },

    // --- KANO ---
    {
        name: "Union Diagnostic & Clinical Services",
        address: "7 Zaria Road, Kano",
        description: "Major diagnostic center in Kano.",
        latitude: 12.0022 + getOffset(),
        longitude: 8.5920 + getOffset(),
        isOpen: true,
        rating: 4.2,
        tests: [
            { name: "CT Scan", price: 40000, description: "Imaging" },
            { name: "Ultrasound", price: 3500, description: "Scan" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
    },

    // --- KATSINA ---
    {
        name: "Tripod Medical Centre",
        address: "IBB Way, Behind FCMB Bank, Katsina",
        description: "Medical centre with diagnostic facilities.",
        latitude: 12.9816 + getOffset(),
        longitude: 7.6223 + getOffset(),
        isOpen: true,
        rating: 4.1,
        tests: [
            { name: "General Checkup", price: 5000, description: "Consultation + Vitals" },
            { name: "Lab Tests", price: 3000, description: "Basic panel" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800"
    },

    // --- KEBBI ---
    {
        name: "Ashmed Specialist Hospital",
        address: "Badariya By Mobile Police Barracks, Kola Road, Birnin Kebbi",
        description: "Specialist hospital with diagnostic unit.",
        latitude: 12.4539 + getOffset(),
        longitude: 4.1975 + getOffset(),
        isOpen: true,
        rating: 4.3,
        tests: [
            { name: "X-Ray", price: 3000, description: "Radiology" },
            { name: "Blood Tests", price: 2000, description: "Hematology" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a092fc4b?auto=format&fit=crop&q=80&w=800"
    },

    // --- KOGI ---
    {
        name: "A4 Radiodiagnostic Centre",
        address: "97 IBB Way, Township/G.R.A, Lokoja, Kogi",
        description: "Focused on radiology and imaging services.",
        latitude: 7.8023 + getOffset(),
        longitude: 6.7333 + getOffset(),
        isOpen: true,
        rating: 4.4,
        tests: [
            { name: "Ultrasound", price: 3500, description: "Scan" },
            { name: "X-Ray", price: 3000, description: "Digital X-Ray" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1579165466741-7f35e4755652?auto=format&fit=crop&q=80&w=800"
    },

    // --- KWARA ---
    {
        name: "Beaconhealth Diagnostics",
        address: "64 Ibrahim Taiwo Road, Taiwo Isale, Ilorin, Kwara",
        description: "Modern diagnostic center in Ilorin.",
        latitude: 8.4799 + getOffset(),
        longitude: 4.5418 + getOffset(),
        isOpen: true,
        rating: 4.5,
        tests: [
            { name: "Full Body Scan", price: 25000, description: "Comprehensive imaging" },
            { name: "Cardiac Profile", price: 12000, description: "Heart health" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800"
    },

    // --- LAGOS ---
    {
        name: "Afriglobal Medicare",
        address: "8 Mobolaji Bank Anthony Way, Ikeja, Lagos",
        description: "A leading diagnostic center offering comprehensive laboratory and imaging services.",
        latitude: 6.5905 + getOffset(),
        longitude: 3.3575 + getOffset(),
        isOpen: true,
        rating: 4.8,
        tests: [
            { name: "Full Body Checkup", price: 45000, description: "Comprehensive health screening" },
            { name: "MRI Scan", price: 85000, description: "High resolution imaging" },
            { name: "Lipid Profile", price: 7500, description: "Cholesterol check" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "MeCure Healthcare",
        address: "Debo Industrial Compound, Oshodi-Apapa Expressway, Lagos",
        description: "State-of-the-art healthcare facility known for advanced diagnostics and eye care.",
        latitude: 6.5432 + getOffset(),
        longitude: 3.3456 + getOffset(),
        isOpen: true,
        rating: 4.7,
        tests: [
            { name: "CT Scan", price: 65000, description: "Computed Tomography" },
            { name: "X-Ray", price: 5000, description: "Digital X-Ray" },
            { name: "Malaria Test", price: 2000, description: "Parasite check" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
    },

    // --- NASARAWA ---
    {
        name: "Digitech Scans And Diagnostics",
        address: "Mararaba, Keffi, Nasarawa",
        description: "Diagnostic services serving the Mararaba/Keffi area.",
        latitude: 8.8472 + getOffset(),
        longitude: 7.8776 + getOffset(), // Approx Mararaba
        isOpen: true,
        rating: 4.0,
        tests: [
            { name: "Ultrasound", price: 3000, description: "Scan" },
            { name: "Lab Tests", price: 2000, description: "Routine" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1516574187841-69301976e499?auto=format&fit=crop&q=80&w=800"
    },

    // --- NIGER ---
    {
        name: "Union Diagnostic & Clinical Services",
        address: "Yoruba Road, Before Mobil Roundabout, Minna, Niger",
        description: "Diagnostic center in Minna.",
        latitude: 9.5836 + getOffset(),
        longitude: 6.5463 + getOffset(),
        isOpen: true,
        rating: 4.1,
        tests: [
            { name: "X-Ray", price: 3500, description: "Radiography" },
            { name: "Lab Tests", price: 2500, description: "Pathology" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800"
    },

    // --- OGUN ---
    {
        name: "Chyme Diagnostics Centre",
        address: "5 Tukuru Close, Sango-Ijokoro Road, Sango-Otta, Ogun",
        description: "Diagnostic center in Sango-Otta.",
        latitude: 6.6906 + getOffset(),
        longitude: 3.2376 + getOffset(),
        isOpen: true,
        rating: 4.2,
        tests: [
            { name: "Ultrasound", price: 3000, description: "Scan" },
            { name: "Blood Sugar", price: 1000, description: "Glucose test" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
    },

    // --- ONDO ---
    {
        name: "Stas Diagnostic Center",
        address: "Ajegunle Street, Akure South, Ondo",
        description: "Diagnostic services in Akure.",
        latitude: 7.2571 + getOffset(),
        longitude: 5.2058 + getOffset(),
        isOpen: true,
        rating: 4.1,
        tests: [
            { name: "Lab Tests", price: 2000, description: "General" },
            { name: "Scan", price: 3000, description: "Ultrasound" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
    },

    // --- OSUN ---
    {
        name: "Beaconhealth Diagnostics",
        address: "57 Laro Street, Isale-Osun, Osogbo, Osun",
        description: "Quality diagnostics in Osogbo.",
        latitude: 7.7827 + getOffset(),
        longitude: 4.5418 + getOffset(),
        isOpen: true,
        rating: 4.3,
        tests: [
            { name: "Full Blood Count", price: 2500, description: "Hematology" },
            { name: "Widal", price: 1500, description: "Typhoid" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
    },

    // --- OYO ---
    {
        name: "Funbell Diagnostics",
        address: "Funbell Place, 8 Okusehinde Street, New Agodi GRA, Ibadan, Oyo",
        description: "Premium diagnostic facility in Ibadan.",
        latitude: 7.3775 + getOffset(),
        longitude: 3.9470 + getOffset(),
        isOpen: true,
        rating: 4.5,
        tests: [
            { name: "CT Scan", price: 45000, description: "Imaging" },
            { name: "Mammogram", price: 15000, description: "Breast screening" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
    },

    // --- PLATEAU ---
    {
        name: "Zetron Medical Diagnostic Centre",
        address: "10 JUTH Road, Lamingo, Jos, Plateau",
        description: "Medical diagnostic center near JUTH.",
        latitude: 9.8965 + getOffset(),
        longitude: 8.8583 + getOffset(),
        isOpen: true,
        rating: 4.4,
        tests: [
            { name: "MRI", price: 75000, description: "Imaging" },
            { name: "Lab Tests", price: 3000, description: "Pathology" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800"
    },

    // --- RIVERS ---
    {
        name: "Image Diagnostics",
        address: "9B Eligbam Road, Port Harcourt, Rivers",
        description: "Specialized in advanced medical imaging.",
        latitude: 4.8156 + getOffset(),
        longitude: 7.0498 + getOffset(),
        isOpen: true,
        rating: 4.5,
        tests: [
            { name: "Ultrasound Scan", price: 5000, description: "Pelvic/Abdominal" },
            { name: "CT Scan", price: 70000, description: "Whole body imaging" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
    },

    // --- SOKOTO ---
    {
        name: "Danmowa Diagnostic Centre",
        address: "No 15 Shehu Shagari Way, Sokoto",
        description: "Diagnostic center in Sokoto.",
        latitude: 13.0059 + getOffset(),
        longitude: 5.2476 + getOffset(),
        isOpen: true,
        rating: 4.0,
        tests: [
            { name: "Lab Tests", price: 2000, description: "Routine" },
            { name: "X-Ray", price: 3000, description: "Radiology" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a092fc4b?auto=format&fit=crop&q=80&w=800"
    },

    // --- TARABA ---
    {
        name: "Federal Medical Centre Jalingo (Diagnostics)",
        address: "Jalingo, Taraba",
        description: "Federal medical centre offering diagnostic services.",
        latitude: 8.8937 + getOffset(),
        longitude: 11.3741 + getOffset(),
        isOpen: true,
        rating: 4.2,
        tests: [
            { name: "General Tests", price: 2000, description: "Lab" },
            { name: "X-Ray", price: 2500, description: "Imaging" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1579165466741-7f35e4755652?auto=format&fit=crop&q=80&w=800"
    },

    // --- YOBE ---
    {
        name: "Second Gate Specialist Hospital",
        address: "Off Sir Kashim Ibrahim Way, Damaturu, Yobe",
        description: "Specialist hospital with diagnostic facilities.",
        latitude: 11.7470 + getOffset(),
        longitude: 11.9608 + getOffset(),
        isOpen: true,
        rating: 4.1,
        tests: [
            { name: "Lab Tests", price: 2000, description: "Pathology" },
            { name: "Scan", price: 3000, description: "Ultrasound" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800"
    },

    // --- ZAMFARA ---
    {
        name: "Poly Diagnostic Centre",
        address: "26 Premier Road, Tudun Wada, Gusau, Zamfara",
        description: "Diagnostic center in Gusau.",
        latitude: 12.1628 + getOffset(),
        longitude: 6.6614 + getOffset(),
        isOpen: true,
        rating: 4.0,
        tests: [
            { name: "Lab Tests", price: 1500, description: "Routine" },
            { name: "X-Ray", price: 3000, description: "Radiology" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
    }
];

export async function seedLabs() {
    const { firestore } = initializeFirebase();
    const labsRef = collection(firestore, 'labs');

    try {
        // Check for existing labs
        const snapshot = await getDocs(labsRef);

        // Delete existing labs to ensure fresh data
        if (!snapshot.empty) {
            console.log("Clearing existing labs...");
            const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            console.log("Existing labs cleared.");
        }

        console.log("Seeding new labs...");
        const batch = writeBatch(firestore);

        SAMPLE_LABS.forEach((lab) => {
            const docRef = doc(labsRef);
            batch.set(docRef, lab);
        });

        await batch.commit();
        console.log('Labs seeded successfully');
        return { success: true, message: 'Labs seeded successfully' };
    } catch (error) {
        console.error('Error seeding labs:', error);
        return { success: false, message: 'Error seeding labs', error };
    }
}
