export interface ResumeData {
    summary: string[];
    skills: string[];
    experience: { duration: string; details: string[] }[];
    education: string[];
    certifications: string[];
}

export interface ATSResult {
    atsScore: number;
    totalExperience: number; // in years
    matchedKeywords: string[];
    missingKeywords: string[];
    keywordBreakdown: {
        technical: number;
        tools: number;
        softSkills: number;
    };
    feedback: string[];
}

// src/services/extractDynamicJDKeywords.ts

export interface ExtractedKeywords {
    keywords: string[];
    phrases: string[];
}