'use client';

import { useState } from 'react';
import { FileText, Download, Share2, Activity, BrainCircuit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useResults } from '@/hooks/use-results';
import { format } from 'date-fns';
import PDFViewer from '@/components/pdf-viewer';
import { TestResult } from '@/types';

export default function TestResultsPage() {
    const { results, loading } = useResults();
    const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
    const [isPdfOpen, setIsPdfOpen] = useState(false);

    const handleViewPdf = (result: TestResult) => {
        setSelectedResult(result);
        setIsPdfOpen(true);
    };

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Test Results</h1>
                <p className="text-gray-600">View and manage your laboratory test reports.</p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading results...</p>
                </div>
            ) : results.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow p-8">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Results Yet</h3>
                    <p className="text-gray-500 mt-2">Book a test to get started with your health journey.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {results.map((result) => (
                        <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <Image src="/result.png" alt="Result" width={40} height={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{result.testName}</h3>
                                        <p className="text-sm text-gray-500">{result.labName} • {format(result.date.toDate(), 'PPP')}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${result.status === 'normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {result.status}
                                </div>
                            </div>

                            {/* AI Summary Section */}
                            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex items-start gap-3">
                                    <BrainCircuit className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-1">AI Interpretation</h4>
                                        <p className="text-indigo-800 leading-relaxed">{result.aiSummary}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 bg-gray-50 flex justify-end gap-3">
                                <Button variant="outline" size="sm" className="gap-2" onClick={() => handleViewPdf(result)}>
                                    <Eye className="w-4 h-4" />
                                    View Official Report
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Download
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedResult && (
                <PDFViewer
                    isOpen={isPdfOpen}
                    onClose={() => setIsPdfOpen(false)}
                    fileUrl={selectedResult.fileUrl}
                    title={`${selectedResult.testName} Report`}
                />
            )}
        </>
    );
}
