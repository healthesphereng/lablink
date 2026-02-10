export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            <p className="mb-4 text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-6 text-gray-800">
                <section>
                    <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you create an account, book a test, or contact us.
                        This may include your name, email address, phone number, and health-related information necessary for lab tests.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Process and manage your lab test bookings.</li>
                        <li>Communicate with you about your appointments and results.</li>
                        <li>Provide AI-powered analysis of your lab results (only when requested).</li>
                        <li>Improve our services and develop new features.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">3. Data Sharing and Disclosure</h2>
                    <p>
                        We respect your privacy. We do not sell your personal data. We typically share your information only with:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Partner laboratories to facilitate your tests.</li>
                        <li>Service providers who assist our operations (e.g., payment processing, hosting).</li>
                        <li>Legal authorities when required by law.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                    <p>
                        Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete your data. Contact us to exercise these rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at support@lablink.vercel.app.
                    </p>
                </section>
            </div>
        </div>
    );
}
