// Types for resume data and ATS result
export interface ResumeData {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
  }
  
export interface Experience {
    company: string;
    role: string;
    duration: string;
    details: string[];
  }
  
export interface Education {
    institution: string;
    degree: string;
    duration: string;
  }
  
export interface ATSResult {
    finalScore: number;
    scoreMessage: {
      keyword: string;
      line: string;
    };
    analysis: {
      jd_match_score: number;
      ats_score: number;
      missing_keywords: string[];
      strengths: string[];
      weaknesses: string[];
      improved_bullets: Array<{ 
        original: string; 
        improved: string; 
      }>;
      summary: string;
    };
    atsScore: {
      totalExperience: number;
      matchedKeywords: string[];
    };
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

export interface ResumeAnalysisState {
  atsResult: ATSResult | null;
  loading: boolean;
  error: string | null;
  analyzeResume: (resumeData: File, jd: string) => Promise<void>;
  resetUploadState: () => void;
}