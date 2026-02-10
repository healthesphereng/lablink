'use client';

import { useState } from 'react';
import { useStorage } from '@/firebase/FirebaseProvider';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2, Upload, FileText, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';

// Define types locally for now to avoid server-client import issues
interface LabResultFinding {
    testName: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    status: 'Normal' | 'High' | 'Low' | 'Abnormal' | 'Critical' | 'Unknown';
    interpretation: string;
}

interface AnalysisResult {
    summary: string;
    findings: LabResultFinding[];
    recommendations: string[];
    disclaimer: string;
}

export default function AnalyzePage() {
    const storage = useStorage();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setResult(null); // Reset previous results

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleAnalyze = async () => {
        if (!file || !storage) return;

        try {
            setUploading(true);

            // 1. Upload to Firebase Storage
            const storageRef = ref(storage, `lab-results/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            setUploading(false);
            setAnalyzing(true);

            // 2. Call Analysis API
            const response = await fetch('/api/results/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileUrl: downloadURL }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Analysis failed');
            }

            const data = await response.json();
            setResult(data);
            toast.success('Analysis complete!');

        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error.message || 'Something went wrong');
        } finally {
            setUploading(false);
            setAnalyzing(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'High':
            case 'Low':
            case 'Abnormal':
                return 'text-orange-600 bg-orange-50';
            case 'Critical':
                return 'text-red-700 bg-red-50';
            case 'Normal':
                return 'text-green-700 bg-green-50';
            default:
                return 'text-gray-700 bg-gray-50';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-center" />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">AI Lab Result Analysis</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Upload a photo of your lab report to get a simple, easy-to-understand explanation.
                    </p>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex flex-col items-center justify-center space-y-6">
                        {!previewUrl ? (
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                    <p className="mb-2 text-sm text-gray-500 font-semibold">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        ) : (
                            <div className="relative w-full max-w-md">
                                <img src={previewUrl} alt="Preview" className="w-full rounded-lg shadow-md border hover:opacity-75 transition-opacity cursor-pointer" onClick={() => { setFile(null); setPreviewUrl(null); setResult(null); }} />
                                <button
                                    onClick={() => { setFile(null); setPreviewUrl(null); setResult(null); }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                                >
                                    <span className="sr-only">Remove</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        )}

                        {file && !result && (
                            <Button
                                onClick={handleAnalyze}
                                disabled={uploading || analyzing}
                                className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                            >
                                {uploading ? (
                                    <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Uploading...</span>
                                ) : analyzing ? (
                                    <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Analyzing (AI)...</span>
                                ) : (
                                    <span className="flex items-center gap-2"><FileText className="w-5 h-5" /> Analyze Results</span>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                {analyzing && (
                    <div className="text-center py-12 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Our AI is reading your report...</p>
                    </div>
                )}

                {result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Summary Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                                <Info className="w-5 h-5" /> Summary
                            </h2>
                            <p className="text-blue-800 leading-relaxed text-lg">
                                {result.summary}
                            </p>
                        </div>

                        {/* Findings Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <h2 className="text-lg font-bold text-gray-900">Detailed Findings</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Test</th>
                                            <th className="px-6 py-3 font-medium">Value</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium">Interpretation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {result.findings.map((finding, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{finding.testName}</td>
                                                <td className="px-6 py-4 text-gray-700">
                                                    {finding.value} <span className="text-gray-400 text-xs">{finding.unit}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(finding.status)}`}>
                                                        {finding.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 text-sm max-w-xs">{finding.interpretation}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" /> Recommendations
                            </h2>
                            <ul className="space-y-3">
                                {result.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
                                        <span className="text-gray-700">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex gap-3 text-sm text-yellow-800">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p>{result.disclaimer}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
