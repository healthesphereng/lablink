import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"

export default function ReliableTestingSection() {
    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2">
            <div className="mb-6 sm:mb-8">
              <span className="text-[#001C3D] font-semibold mb-2 block text-sm sm:text-base">YOUR HEALTH, OUR PRIORITY</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Reliable Lab Testing for
                <span className="text-blue-900 block mt-1">All Your Health Needs</span>
              </h2>
            </div>
            
            <Tabs defaultValue="why-need" className="w-full flex flex-col">
              <TabsList className="h-auto flex-col md:flex-row mb-10 md:mb-0 min-h-[150px] md:min-h-fit gap-3 w-full bg-transparent">
                <TabsTrigger value="why-need" className="w-full sm:w-auto flex-1 text-left px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-200 data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 flex items-center justify-between group">
                  <span>Why Need Consultation?</span>
                </TabsTrigger>
                <TabsTrigger value="why-choose" className="w-full sm:w-auto flex-1 text-left px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-200 data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 flex items-center justify-between group">
                  <span>Why Choose Us</span>
                </TabsTrigger>
                <TabsTrigger value="how-works" className="w-full sm:w-auto flex-1 text-left px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-200 data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 flex items-center justify-between group">
                  <span>How it Works</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="why-need" className="mt-2 sm:mt-8 p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">Why Regular Lab Testing Matters</h3>
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">Staying informed about your health is essential for early detection, effective treatment, and peace of mind. Our lab testing services help you:</p>
                  <ul className="space-y-3 sm:space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="mt-1"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"/></span>
                      <span className="text-gray-700 text-sm sm:text-base">Get timely diagnosis and early detection of health conditions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"/></span>
                      <span className="text-gray-700 text-sm sm:text-base">Access a wide range of lab tests from the comfort of your home</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"/></span>
                      <span className="text-gray-700 text-sm sm:text-base">Receive accurate and reliable test results</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"/></span>
                      <span className="text-gray-700 text-sm sm:text-base">Ensure continuity of care with integrated health support</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="why-choose" className="mt-6 sm:mt-8 p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                {/* Content for Why Choose Us */}
              </TabsContent>
              <TabsContent value="how-works" className="mt-6 sm:mt-8 p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                {/* Content for How it Works */}
              </TabsContent>
            </Tabs>
          </div>
  
          <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
            <div className="relative aspect-[4/3] mb-6 sm:mb-8">
              <img src="/images/lab-link-hero.jpg" alt="Medical lab professionals working" className="rounded-xl sm:rounded-2xl object-cover w-full h-full shadow-lg sm:shadow-xl" />
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-t from-blue-900/20 to-transparent"></div>
            </div>
            <div className="bg-gradient-to-br from-[#001C3D] to-blue-900 text-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg sm:shadow-xl">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Ready to Take Charge of Your Health?</h3>
              <p className="mb-6 sm:mb-8 text-blue-100 leading-relaxed text-sm sm:text-base">Book a test with our trusted lab today and get accurate, timely results to support your health journey.</p>
              <button type="button" className="w-full sm:w-auto bg-white text-blue-900 px-4 sm:px-6 py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center sm:justify-start gap-2 group text-sm sm:text-base">
                Book a Lab Test
              </button>
            </div>
          </div>
        </div>
      </div>
    )
}
