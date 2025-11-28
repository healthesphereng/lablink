// This script uses Firebase Client SDK to populate lab tests
// Run with: node scripts/populate-lab-tests.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Firebase configuration (from your .env.local or Firebase console)
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDFwFQdIaKKKaUJLHYfVVBJYxRjNlSNqJo",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-109280062-71202.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-109280062-71202",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-109280062-71202.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "109280062",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:109280062:web:71202"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const labTests = [
    // HAEMATOLOGY
    {
        id: 'fbc',
        name: 'Full Blood Count (FBC / CBC)',
        category: 'Haematology',
        description: 'Complete analysis of blood cells including RBC, WBC, platelets, and hemoglobin levels',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Anemia screening', 'Infection detection', 'General health check']
    },
    {
        id: 'pcv',
        name: 'Packed Cell Volume (PCV)',
        category: 'Haematology',
        description: 'Measures the proportion of blood volume occupied by red blood cells',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Anemia diagnosis', 'Dehydration assessment']
    },
    {
        id: 'hb',
        name: 'Haemoglobin (HB)',
        category: 'Haematology',
        description: 'Measures the amount of hemoglobin in blood',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Anemia screening', 'Blood loss assessment']
    },
    {
        id: 'wbc',
        name: 'White Blood Cell Count (WBC)',
        category: 'Haematology',
        description: 'Counts white blood cells to assess immune system function',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Infection detection', 'Immune system evaluation']
    },
    {
        id: 'platelet',
        name: 'Platelet Count',
        category: 'Haematology',
        description: 'Measures platelet levels for blood clotting assessment',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Bleeding disorders', 'Clotting assessment']
    },
    {
        id: 'esr',
        name: 'ESR (Erythrocyte Sedimentation Rate)',
        category: 'Haematology',
        description: 'Measures inflammation in the body',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Inflammation detection', 'Disease monitoring']
    },
    {
        id: 'blood-group',
        name: 'Blood Group',
        category: 'Haematology',
        description: 'Determines ABO and Rh blood type',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Blood transfusion', 'Pregnancy planning']
    },
    {
        id: 'genotype',
        name: 'Genotype',
        category: 'Haematology',
        description: 'Determines hemoglobin genotype (AA, AS, SS, AC, SC)',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Sickle cell screening', 'Marriage counseling', 'Pregnancy planning']
    },
    {
        id: 'malaria-test',
        name: 'Malaria Parasite Test (MP)',
        category: 'Haematology',
        description: 'Detects malaria parasites in blood',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Malaria diagnosis', 'Fever investigation']
    },

    // CLINICAL CHEMISTRY
    {
        id: 'kft',
        name: 'Kidney Function Test (KFT)',
        category: 'Clinical Chemistry',
        description: 'Comprehensive kidney function assessment including urea, creatinine, and electrolytes',
        preparation: 'Fasting may be required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Kidney disease screening', 'Diabetes monitoring', 'Hypertension management']
    },
    {
        id: 'lft',
        name: 'Liver Function Test (LFT)',
        category: 'Clinical Chemistry',
        description: 'Evaluates liver health through enzyme and protein levels',
        preparation: 'Fasting recommended',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Liver disease screening', 'Medication monitoring', 'Jaundice investigation']
    },
    {
        id: 'fbs',
        name: 'Fasting Blood Sugar (FBS)',
        category: 'Clinical Chemistry',
        description: 'Measures blood glucose after fasting',
        preparation: '8-12 hours fasting required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Diabetes screening', 'Blood sugar monitoring']
    },
    {
        id: 'rbs',
        name: 'Random Blood Sugar (RBS)',
        category: 'Clinical Chemistry',
        description: 'Measures blood glucose at any time',
        preparation: 'No fasting required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Diabetes monitoring', 'Emergency glucose check']
    },
    {
        id: 'hba1c',
        name: 'HbA1c',
        category: 'Clinical Chemistry',
        description: 'Measures average blood sugar over 2-3 months',
        preparation: 'No fasting required',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Diabetes diagnosis', 'Long-term glucose control monitoring']
    },
    {
        id: 'lipid-profile',
        name: 'Lipid Profile',
        category: 'Clinical Chemistry',
        description: 'Measures cholesterol and triglyceride levels',
        preparation: '9-12 hours fasting required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Heart disease risk assessment', 'Cholesterol monitoring']
    },
    {
        id: 'uric-acid',
        name: 'Uric Acid',
        category: 'Clinical Chemistry',
        description: 'Measures uric acid levels in blood',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Gout diagnosis', 'Kidney stone assessment']
    },
    {
        id: 'electrolytes',
        name: 'Electrolytes (Na, K, Cl, HCO3)',
        category: 'Clinical Chemistry',
        description: 'Measures essential minerals in blood',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Dehydration assessment', 'Kidney function', 'Heart health']
    },

    // MICROBIOLOGY
    {
        id: 'urine-mcs',
        name: 'Urine Microscopy Culture & Sensitivity (MCS)',
        category: 'Microbiology',
        description: 'Identifies bacteria in urine and determines antibiotic sensitivity',
        preparation: 'Clean catch midstream urine',
        sampleType: 'Urine',
        turnaroundTime: '2-3 days',
        commonUses: ['UTI diagnosis', 'Antibiotic selection']
    },
    {
        id: 'stool-mcs',
        name: 'Stool MCS',
        category: 'Microbiology',
        description: 'Identifies bacteria and parasites in stool',
        preparation: 'Fresh stool sample',
        sampleType: 'Stool',
        turnaroundTime: '2-3 days',
        commonUses: ['Diarrhea investigation', 'Food poisoning diagnosis']
    },
    {
        id: 'hvs-mcs',
        name: 'HVS MCS',
        category: 'Microbiology',
        description: 'High vaginal swab culture for infection detection',
        preparation: 'Avoid douching 24hrs before',
        sampleType: 'Vaginal swab',
        turnaroundTime: '2-3 days',
        commonUses: ['Vaginal infection diagnosis', 'STI screening']
    },
    {
        id: 'blood-culture',
        name: 'Blood Culture',
        category: 'Microbiology',
        description: 'Detects bacteria or fungi in bloodstream',
        preparation: 'Before antibiotics if possible',
        sampleType: 'Blood',
        turnaroundTime: '3-5 days',
        commonUses: ['Sepsis diagnosis', 'Fever investigation']
    },

    // IMMUNOLOGY / SEROLOGY
    {
        id: 'hiv-screening',
        name: 'HIV 1 & 2 Screening',
        category: 'Immunology/Serology',
        description: 'Rapid screening test for HIV antibodies',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['HIV screening', 'Pre-employment medical', 'Antenatal care']
    },
    {
        id: 'hbsag',
        name: 'Hepatitis B Surface Antigen (HBsAg)',
        category: 'Immunology/Serology',
        description: 'Screens for Hepatitis B infection',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Hepatitis B screening', 'Pre-employment medical', 'Pregnancy screening']
    },
    {
        id: 'hcv',
        name: 'Hepatitis C Antibody',
        category: 'Immunology/Serology',
        description: 'Screens for Hepatitis C infection',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Hepatitis C screening', 'Liver disease investigation']
    },
    {
        id: 'vdrl',
        name: 'RPR / VDRL (Syphilis)',
        category: 'Immunology/Serology',
        description: 'Screening test for syphilis',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Syphilis screening', 'STI panel', 'Antenatal care']
    },
    {
        id: 'widal',
        name: 'Widal Test',
        category: 'Immunology/Serology',
        description: 'Screening test for typhoid fever',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Typhoid fever diagnosis', 'Fever investigation']
    },
    {
        id: 'crp',
        name: 'CRP (C-Reactive Protein)',
        category: 'Immunology/Serology',
        description: 'Measures inflammation marker',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Inflammation detection', 'Infection monitoring', 'Heart disease risk']
    },
    {
        id: 'covid-rapid',
        name: 'COVID-19 Rapid Test',
        category: 'Immunology/Serology',
        description: 'Rapid antigen test for COVID-19',
        preparation: 'No special preparation required',
        sampleType: 'Nasal swab',
        turnaroundTime: '15-30 minutes',
        commonUses: ['COVID-19 screening', 'Travel requirements']
    },

    // HORMONAL ASSAYS
    {
        id: 'tsh',
        name: 'TSH (Thyroid Stimulating Hormone)',
        category: 'Hormonal Assays',
        description: 'Evaluates thyroid function',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Thyroid disorder screening', 'Hypothyroidism diagnosis']
    },
    {
        id: 'ft3-ft4',
        name: 'FT3 / FT4',
        category: 'Hormonal Assays',
        description: 'Free thyroid hormones measurement',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Thyroid function assessment', 'Hyperthyroidism diagnosis']
    },
    {
        id: 'prolactin',
        name: 'Prolactin',
        category: 'Hormonal Assays',
        description: 'Measures prolactin hormone levels',
        preparation: 'Morning sample preferred',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Infertility investigation', 'Irregular periods', 'Breast milk production issues']
    },
    {
        id: 'lh',
        name: 'LH (Luteinizing Hormone)',
        category: 'Hormonal Assays',
        description: 'Reproductive hormone measurement',
        preparation: 'Timing depends on menstrual cycle',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Fertility assessment', 'Ovulation monitoring', 'PCOS diagnosis']
    },
    {
        id: 'fsh',
        name: 'FSH (Follicle Stimulating Hormone)',
        category: 'Hormonal Assays',
        description: 'Reproductive hormone measurement',
        preparation: 'Timing depends on menstrual cycle',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Fertility assessment', 'Menopause diagnosis', 'PCOS screening']
    },
    {
        id: 'testosterone',
        name: 'Testosterone',
        category: 'Hormonal Assays',
        description: 'Measures testosterone levels',
        preparation: 'Morning sample preferred',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Male fertility', 'Low libido', 'PCOS in women']
    },
    {
        id: 'progesterone',
        name: 'Progesterone',
        category: 'Hormonal Assays',
        description: 'Measures progesterone hormone',
        preparation: 'Day 21 of cycle for ovulation check',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Ovulation confirmation', 'Pregnancy monitoring', 'Fertility assessment']
    },
    {
        id: 'psa',
        name: 'PSA (Prostate Specific Antigen)',
        category: 'Hormonal Assays',
        description: 'Prostate cancer screening marker',
        preparation: 'Avoid ejaculation 48hrs before',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Prostate cancer screening', 'Prostate health monitoring']
    },
    {
        id: 'beta-hcg',
        name: 'Beta-hCG (Pregnancy Test - Serum)',
        category: 'Hormonal Assays',
        description: 'Quantitative pregnancy hormone test',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Pregnancy confirmation', 'Early pregnancy monitoring', 'Ectopic pregnancy diagnosis']
    },

    // TUMOR MARKERS
    {
        id: 'afp',
        name: 'AFP (Alpha-Fetoprotein)',
        category: 'Tumor Markers',
        description: 'Liver cancer and germ cell tumor marker',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: '2-3 days',
        commonUses: ['Liver cancer screening', 'Testicular cancer', 'Pregnancy monitoring']
    },
    {
        id: 'ca125',
        name: 'CA-125',
        category: 'Tumor Markers',
        description: 'Ovarian cancer marker',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: '2-3 days',
        commonUses: ['Ovarian cancer screening', 'Treatment monitoring']
    },
    {
        id: 'cea',
        name: 'CEA',
        category: 'Tumor Markers',
        description: 'Colorectal cancer marker',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: '2-3 days',
        commonUses: ['Colorectal cancer monitoring', 'Treatment response']
    },

    // COAGULATION PROFILE
    {
        id: 'pt-inr',
        name: 'PT (Prothrombin Time) / INR',
        category: 'Coagulation Profile',
        description: 'Measures blood clotting time',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Warfarin monitoring', 'Bleeding disorders', 'Liver function']
    },
    {
        id: 'aptt',
        name: 'APTT',
        category: 'Coagulation Profile',
        description: 'Activated partial thromboplastin time',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['Heparin monitoring', 'Bleeding disorders', 'Clotting assessment']
    },
    {
        id: 'd-dimer',
        name: 'D-Dimer',
        category: 'Coagulation Profile',
        description: 'Detects abnormal blood clotting',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: 'Same day',
        commonUses: ['DVT screening', 'Pulmonary embolism', 'Stroke risk']
    },

    // CARDIAC MARKERS
    {
        id: 'troponin',
        name: 'Troponin I / T',
        category: 'Cardiac Markers',
        description: 'Heart attack marker',
        preparation: 'Emergency test',
        sampleType: 'Blood',
        turnaroundTime: '1-2 hours',
        commonUses: ['Heart attack diagnosis', 'Chest pain investigation']
    },

    // URINALYSIS
    {
        id: 'urinalysis',
        name: 'Urinalysis (Dipstick + Microscopy)',
        category: 'Urinalysis',
        description: 'Complete urine analysis',
        preparation: 'Clean catch midstream urine',
        sampleType: 'Urine',
        turnaroundTime: 'Same day',
        commonUses: ['UTI screening', 'Kidney disease', 'Diabetes monitoring']
    },
    {
        id: 'pregnancy-urine',
        name: 'Pregnancy Test (Urine)',
        category: 'Urinalysis',
        description: 'Rapid urine pregnancy test',
        preparation: 'First morning urine preferred',
        sampleType: 'Urine',
        turnaroundTime: '15 minutes',
        commonUses: ['Pregnancy confirmation', 'Missed period investigation']
    },

    // STOOL TESTS
    {
        id: 'stool-routine',
        name: 'Stool Routine Analysis',
        category: 'Stool Tests',
        description: 'Microscopic examination of stool',
        preparation: 'Fresh stool sample',
        sampleType: 'Stool',
        turnaroundTime: 'Same day',
        commonUses: ['Diarrhea investigation', 'Parasite detection']
    },
    {
        id: 'occult-blood',
        name: 'Stool Occult Blood',
        category: 'Stool Tests',
        description: 'Detects hidden blood in stool',
        preparation: 'Avoid red meat 3 days before',
        sampleType: 'Stool',
        turnaroundTime: 'Same day',
        commonUses: ['Colorectal cancer screening', 'GI bleeding detection']
    },

    // GENETIC / MOLECULAR
    {
        id: 'genexpert-tb',
        name: 'PCR for TB (GeneXpert)',
        category: 'Genetic/Molecular',
        description: 'Rapid TB detection using molecular methods',
        preparation: 'Sputum sample required',
        sampleType: 'Sputum',
        turnaroundTime: '2-4 hours',
        commonUses: ['TB diagnosis', 'Drug resistance detection']
    },
    {
        id: 'hiv-viral-load',
        name: 'Viral Load (HIV)',
        category: 'Genetic/Molecular',
        description: 'Quantifies HIV virus in blood',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: '3-5 days',
        commonUses: ['HIV treatment monitoring', 'Drug efficacy assessment']
    },
    {
        id: 'covid-pcr',
        name: 'COVID-19 PCR',
        category: 'Genetic/Molecular',
        description: 'Molecular test for COVID-19',
        preparation: 'No special preparation required',
        sampleType: 'Nasal/throat swab',
        turnaroundTime: '24-48 hours',
        commonUses: ['COVID-19 diagnosis', 'Travel requirements', 'Confirmatory testing']
    },

    // SPECIAL TESTS
    {
        id: 'iron-studies',
        name: 'Iron Studies',
        category: 'Special Tests',
        description: 'Comprehensive iron status assessment',
        preparation: 'Fasting recommended',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Anemia investigation', 'Iron deficiency diagnosis']
    },
    {
        id: 'ferritin',
        name: 'Ferritin',
        category: 'Special Tests',
        description: 'Measures iron storage levels',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Iron deficiency', 'Anemia diagnosis', 'Iron overload']
    },
    {
        id: 'vitamin-b12',
        name: 'Vitamin B12',
        category: 'Special Tests',
        description: 'Measures B12 vitamin levels',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Anemia investigation', 'Neurological symptoms', 'Fatigue assessment']
    },
    {
        id: 'folate',
        name: 'Folate',
        category: 'Special Tests',
        description: 'Measures folate (B9) levels',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: '1-2 days',
        commonUses: ['Anemia diagnosis', 'Pregnancy planning', 'Neural tube defect prevention']
    }
];

async function populateLabTests() {
    console.log('Starting to populate lab tests...');

    try {
        let count = 0;

        for (const test of labTests) {
            const testRef = doc(db, 'labTests', test.id);
            await setDoc(testRef, test);
            count++;
            console.log(`✓ Added: ${test.name}`);
        }

        console.log(`\n✅ Successfully added ${count} lab tests to Firestore!`);

        // Print summary by category
        const categories = {};
        labTests.forEach(test => {
            categories[test.category] = (categories[test.category] || 0) + 1;
        });

        console.log('\n📊 Tests by Category:');
        Object.entries(categories).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} tests`);
        });

    } catch (error) {
        console.error('❌ Error populating lab tests:', error);
    } finally {
        process.exit();
    }
}

populateLabTests();
