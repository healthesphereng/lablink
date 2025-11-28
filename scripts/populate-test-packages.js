const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDFwFQdIaKKKaUJLHYfVVBJYxRjNlSNqJo",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-109280062-71202.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-109280062-71202",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-109280062-71202.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "109280062",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:109280062:web:71202"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testPackages = [
    {
        id: 'diabetes-panel',
        name: 'Diabetes Screening Panel',
        description: 'Comprehensive diabetes screening and monitoring package',
        tests: ['fbs', 'hba1c', 'lipid-profile', 'uric-acid'],
        category: 'Chronic Disease',
        icon: '🩺',
        popular: true,
        estimatedPrice: 15000,
        discount: 15
    },
    {
        id: 'fertility-female',
        name: 'Female Fertility Panel',
        description: 'Complete hormonal assessment for female fertility',
        tests: ['fsh', 'lh', 'prolactin', 'progesterone', 'tsh'],
        category: 'Fertility',
        icon: '👶',
        popular: true,
        estimatedPrice: 25000,
        discount: 20
    },
    {
        id: 'fertility-male',
        name: 'Male Fertility Panel',
        description: 'Hormonal assessment for male fertility',
        tests: ['testosterone', 'fsh', 'lh', 'prolactin'],
        category: 'Fertility',
        icon: '👨',
        popular: false,
        estimatedPrice: 20000,
        discount: 15
    },
    {
        id: 'antenatal-basic',
        name: 'Antenatal Profile (Basic)',
        description: 'Essential tests for pregnancy monitoring',
        tests: ['fbc', 'blood-group', 'genotype', 'hiv-screening', 'hbsag', 'vdrl', 'urinalysis'],
        category: 'Pregnancy',
        icon: '🤰',
        popular: true,
        estimatedPrice: 18000,
        discount: 20
    },
    {
        id: 'pre-employment',
        name: 'Pre-Employment Medical',
        description: 'Standard medical screening for employment',
        tests: ['fbc', 'blood-group', 'hiv-screening', 'hbsag', 'urinalysis', 'fbs'],
        category: 'Employment',
        icon: '💼',
        popular: true,
        estimatedPrice: 12000,
        discount: 15
    },
    {
        id: 'full-health-checkup',
        name: 'Full Health Checkup',
        description: 'Comprehensive health screening package',
        tests: ['fbc', 'lft', 'kft', 'fbs', 'lipid-profile', 'urinalysis', 'hiv-screening', 'hbsag'],
        category: 'General Health',
        icon: '🏥',
        popular: true,
        estimatedPrice: 28000,
        discount: 25
    },
    {
        id: 'thyroid-panel',
        name: 'Thyroid Function Panel',
        description: 'Complete thyroid assessment',
        tests: ['tsh', 'ft3-ft4'],
        category: 'Hormonal',
        icon: '🦋',
        popular: false,
        estimatedPrice: 12000,
        discount: 10
    },
    {
        id: 'sti-screening',
        name: 'STI Screening Panel',
        description: 'Comprehensive sexually transmitted infection screening',
        tests: ['hiv-screening', 'hbsag', 'hcv', 'vdrl'],
        category: 'Sexual Health',
        icon: '🔬',
        popular: false,
        estimatedPrice: 15000,
        discount: 15
    },
    {
        id: 'cardiac-risk',
        name: 'Cardiac Risk Assessment',
        description: 'Heart health and cardiovascular risk evaluation',
        tests: ['lipid-profile', 'fbs', 'crp', 'electrolytes'],
        category: 'Cardiac',
        icon: '❤️',
        popular: false,
        estimatedPrice: 16000,
        discount: 15
    },
    {
        id: 'kidney-health',
        name: 'Kidney Health Panel',
        description: 'Comprehensive kidney function assessment',
        tests: ['kft', 'electrolytes', 'urinalysis', 'uric-acid'],
        category: 'Renal',
        icon: '🫘',
        popular: false,
        estimatedPrice: 14000,
        discount: 15
    },
    {
        id: 'liver-health',
        name: 'Liver Health Panel',
        description: 'Complete liver function evaluation',
        tests: ['lft', 'hbsag', 'hcv'],
        category: 'Hepatic',
        icon: '🫁',
        popular: false,
        estimatedPrice: 13000,
        discount: 15
    },
    {
        id: 'anemia-workup',
        name: 'Anemia Investigation',
        description: 'Comprehensive anemia screening and diagnosis',
        tests: ['fbc', 'iron-studies', 'ferritin', 'vitamin-b12', 'folate'],
        category: 'Hematology',
        icon: '🩸',
        popular: false,
        estimatedPrice: 18000,
        discount: 20
    },
    {
        id: 'cancer-screening-female',
        name: 'Female Cancer Screening',
        description: 'Tumor marker screening for women',
        tests: ['ca125', 'cea', 'afp'],
        category: 'Cancer Screening',
        icon: '🎗️',
        popular: false,
        estimatedPrice: 22000,
        discount: 15
    },
    {
        id: 'prostate-health',
        name: 'Prostate Health Panel',
        description: 'Prostate cancer screening for men',
        tests: ['psa', 'urinalysis'],
        category: 'Men\'s Health',
        icon: '👨‍⚕️',
        popular: false,
        estimatedPrice: 10000,
        discount: 10
    },
    {
        id: 'covid-travel',
        name: 'COVID-19 Travel Package',
        description: 'COVID testing for travel requirements',
        tests: ['covid-pcr'],
        category: 'Travel',
        icon: '✈️',
        popular: true,
        estimatedPrice: 25000,
        discount: 0
    }
];

async function populateTestPackages() {
    console.log('Starting to populate test packages...');

    try {
        let count = 0;

        for (const pkg of testPackages) {
            const pkgRef = doc(db, 'testPackages', pkg.id);
            await setDoc(pkgRef, pkg);
            count++;
            console.log(`✓ Added: ${pkg.name}`);
        }

        console.log(`\n✅ Successfully added ${count} test packages to Firestore!`);

        // Print summary by category
        const categories = {};
        testPackages.forEach(pkg => {
            categories[pkg.category] = (categories[pkg.category] || 0) + 1;
        });

        console.log('\n📊 Packages by Category:');
        Object.entries(categories).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} package(s)`);
        });

        const popularCount = testPackages.filter(p => p.popular).length;
        console.log(`\n⭐ Popular packages: ${popularCount}`);

    } catch (error) {
        console.error('❌ Error populating test packages:', error);
    } finally {
        process.exit();
    }
}

populateTestPackages();
