export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            <p className="mb-4 text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-6 text-gray-800">
                <section>
                    <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using LabLink, you agree to be bound by these Terms of Service. If you do not agree, strictly do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">2. Medical Disclaimer</h2>
                    <p className="font-medium text-red-600 bg-red-50 p-4 rounded-lg">
                        LabLink is not a substitute for professional medical advice, diagnosis, or treatment.
                        The AI analysis feature is for informational purposes only. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to provide accurate and complete information when booking tests.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">4. Service Modifications</h2>
                    <p>
                        We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
                    <p>
                        In no event shall LabLink or its partners be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">6. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
                    </p>
                </section>
            </div>
        </div>
    );
}
