'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema: Accepts a base64 string or URL of the image or PDF document.
const LabResultAnalysisInputSchema = z.object({
    fileUrl: z.string().describe('Public URL or base64 encoded data (data:image/... or data:application/pdf;base64,...) of the lab result.'),
});
export type LabResultAnalysisInput = z.infer<typeof LabResultAnalysisInputSchema>;

// Output Schema: Structured analysis of the lab result
const LabResultFindingSchema = z.object({
    testName: z.string().describe('Name of the test (e.g., Hemoglobin, WBC)'),
    value: z.string().describe(' The numerical value or result found'),
    unit: z.string().optional().describe('Unit of measurement (e.g., g/dL, %)'),
    referenceRange: z.string().optional().describe(' The normal range listed on the report'),
    status: z.enum(['Normal', 'High', 'Low', 'Abnormal', 'Critical', 'Unknown']).describe('Clinical status of the result'),
    interpretation: z.string().describe('A simple, layman-friendly explanation of what this result means'),
});

const LabResultAnalysisOutputSchema = z.object({
    summary: z.string().describe('A clear, reassuring one-paragraph summary of the overall health picture.'),
    findings: z.array(LabResultFindingSchema).describe('List of key findings from the report, focusing on abnormal or important results.'),
    recommendations: z.array(z.string()).describe('List of actionable health recommendations based on the results.'),
    disclaimer: z.string().describe('Standard medical disclaimer.'),
});
export type LabResultAnalysisOutput = z.infer<typeof LabResultAnalysisOutputSchema>;

// Define the Prompt
const labResultAnalysisPrompt = ai.definePrompt({
    name: 'labResultAnalysisPrompt',
    input: { schema: LabResultAnalysisInputSchema },
    output: { schema: LabResultAnalysisOutputSchema },
    prompt: `
You are an expert medical lab technician and compassionate health assistant.
Your task is to analyze the provided medical laboratory result document or image.

Extract the test results accurately and provide a patient-friendly interpretation.
Focus on explaining what the values mean in simple terms.
If a result is "High" or "Low" or flagged in the document, strictly mark it as such.
If a result is within the reference range, mark it as "Normal".

Structure your advice to be helpful but always include a disclaimer that this is not a substitute for professional medical advice.

Input Document/Image:
{{media url=fileUrl}}
`,
});

// Define the Flow
export const analyzeLabResultFlow = ai.defineFlow(
    {
        name: 'analyzeLabResultFlow',
        inputSchema: LabResultAnalysisInputSchema,
        outputSchema: LabResultAnalysisOutputSchema,
    },
    async (input) => {
        const { output } = await labResultAnalysisPrompt(input);
        return output!;
    }
);
