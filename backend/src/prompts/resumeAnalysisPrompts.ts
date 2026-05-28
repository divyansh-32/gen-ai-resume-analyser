import { ResumeSection } from "../services/pdfParserService";
import { ATSResult } from "../types/atsInterfaces";

export function getResumeAnalysisPrompt(resumeData: ResumeSection, jobDescription: string, atsScore: ATSResult) {
    return `You are an expert ATS resume reviewer and technical recruiter.

            Your task is to analyze the candidate's resume against the provided job description.

            Evaluate the resume based on:
            1. ATS compatibility
            2. relevance to the job description
            3. keyword alignment
            4. measurable achievements
            5. technical skill match
            6. clarity and impact of work experience
            7. missing qualifications or gaps

            Return ONLY valid JSON in this exact format:

            {
            "ats_score": number out of 100,
            "jd_match_score": number out of 100,
            "strengths": [
                "string"
            ],
            "weaknesses": [
                "string"
            ],
            "missing_keywords": [
                "string"
            ],
            "suggestions": [
                "string"
            ],
            "improved_bullets": [
                {
                "original": "string",
                "improved": "string"
                }
            ],
            "summary": "string"
            }

            Rules:
            - Be concise but specific.
            - Suggestions must be actionable.
            - Missing keywords must come only from the job description.
            - Rewrite bullets for clarity and impact.Do NOT invent metrics, percentages, or       numbers unless explicitly present in the resume. If no measurable value exists, improve wording without adding data.statements.
            - Do not add extra fields.
            - Do not include markdown.
            - Do not explain the JSON.

            Also utilize this ATS data ${atsScore} in your analysis and feedback.
            Do not estimate experience independently.Use only provided verified values.

            Only list weaknesses that are directly relevant to the provided job description.Do not mention gaps unless they impact role fit.

            Resume Data:
            ${JSON.stringify(resumeData)}

            Job Description:
            ${jobDescription}
            `;
}