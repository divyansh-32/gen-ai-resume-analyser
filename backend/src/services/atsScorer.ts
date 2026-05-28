interface ResumeData {
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

interface ExtractedKeywords {
    keywords: string[];
    phrases: string[];
}

// 1. Move static data outside functions for performance
const STOP_WORDS = new Set([
    "the", "and", "for", "with", "you", "will", "our", "this", "that", "from", "have", "your", "their",
    "using", "ability", "experience", "years", "work", "good", "great", "plus", "such", "mainly", "into",
    "what", "help", "next", "basic", "nice", "etc.", "learning", "create", "beautiful", "thinking",
    "products", "designed", "experiences", "scratch", "latest", "cutting", "edge", "dynamic", "culture.",
    "build", "customer", "clients.", "generation", "developers", "positive", "industry.", "years.",
    "hands-on", "broad", "mix", "can", "considerable", "have.", "follow", "concepts.", "skills",
    "including", "exposure", "plus.", "gaining", "rapidly"
]);

const TECH_KEYWORDS = ["node.js", "typescript", "javascript", "express", "mongodb", "postgresql", "aws", "docker", "kubernetes", "microservices", "rest api", "graphql", "redis", "sql"];
const TOOL_KEYWORDS = ["git", "bitbucket", "jest", "sonarqube", "azure", "aws", "jira", "postman"];
const SOFT_SKILLS = ["leadership", "collaboration", "mentoring", "communication", "problem-solving", "stakeholder"];

export function ATSScorer(resume: ResumeData, jd: string): ATSResult {
    const jdLower = jd.toLowerCase();
    const resumeText = [
        resume.summary,
        ...resume.skills,
        ...resume.experience.flatMap(e => e.details),
        ...resume.education,
        ...resume.certifications
    ].join(" ").toLowerCase();

    // 2. Industry Logic: Detect Seniority
    const isSenior = /\bsenior\b|\blead\b|\barchitect\b|\bprincipal\b/i.test(jdLower);

    // 3. Category Matching (Now correctly filters by what the JD actually asks for)
    const technical = getMatches(TECH_KEYWORDS, resumeText, jdLower);
    const tools = getMatches(TOOL_KEYWORDS, resumeText, jdLower);
    const softSkills = getMatches(SOFT_SKILLS, resumeText, jdLower);

    // 4. Dynamic Bonus: Keywords unique to this JD but not in our hardcoded lists
    const dynamic = extractDynamicJDKeywords(jdLower);
    const staticLib = new Set([...TECH_KEYWORDS, ...TOOL_KEYWORDS, ...SOFT_SKILLS]);
    const bonusKeywords = dynamic.keywords.filter(k => !staticLib.has(k));
    const bonusMatches = bonusKeywords.filter(k => resumeText.includes(k));

    // 5. IT Industry Weighted Scoring
    let score = 0;
    score += (technical.score / 100) * 50; // Tech: 50%
    score += (tools.score / 100) * 15;      // Tools: 15%
    score += (softSkills.score / 100) * 10; // Soft Skills: 10%

    // Experience logic
    if (isSenior && resume.experience.length >= 3) score += 10;
    else if (!isSenior && resume.experience.length >= 1) score += 10;

    // Certifications & Impact Metrics (Crucial for IT)
    if (resume.certifications.length > 0) score += 10;
    if (/\d+%|\d+\+|improved|optimized|automated|scaled/i.test(resumeText)) score += 5;

    // Integration into your ATSScorer
    const totalExpMonths = calculateTotalExperience(resume.experience);

    const atsScore = Math.round(Math.min(score, 100));

    // 6. Generate Contextual Feedback
    const feedback: string[] = [];
    if (technical.score < 70) feedback.push("Technical alignment is low. Highlight core technologies mentioned in the JD.");
    if (isSenior && !/lead|managed|architected|mentored/i.test(resumeText)) {
        feedback.push("For senior roles, emphasize leadership and architectural impact.");
    }

    return {
        atsScore,
        totalExperience: (totalExpMonths/12).toFixed(1) as unknown as number,
        matchedKeywords: Array.from(new Set([...technical.matched, ...tools.matched, ...bonusMatches])),
        missingKeywords: [...technical.missing, ...tools.missing],
        keywordBreakdown: {
            technical: technical.score,
            tools: tools.score,
            softSkills: softSkills.score
        },
        feedback
    };
}

export function extractDynamicJDKeywords(jdText: string): ExtractedKeywords {
    const cleaned = jdText.replace(/[^\w\s+.#-]/g, " ");
    const words = cleaned.split(/\s+/)
        .map(w => w.trim().toLowerCase())
        .filter(w => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

    const freqMap: Record<string, number> = {};
    words.forEach(w => freqMap[w] = (freqMap[w] || 0) + 1);

    const keywords = Object.entries(freqMap)
        .sort((a, b) => b[1] - a[1])
        .map(([word]) => word)
        .slice(0, 20);

    // Improved Phrase Regex: Catch lowercase IT terms like "node.js" or "rest api"
    const phraseMatches = jdText.match(/\b[a-z0-9+#.-]+(?:\s+[a-z0-9+#.-]+){1,2}\b/gi) || [];
    const phrases = [...new Set(phraseMatches)]
        .filter(p => p.split(" ").length > 1 && p.split(" ").length <= 3)
        .slice(0, 10);

    return { keywords, phrases };
}

function calculateTotalExperience(experience: { duration: string }[]): number {
    let totalMonths = 0;
    const now = new Date(); // Use new Date(2026, 3, 25) for your specific context

    experience.forEach(exp => {
        // Regex to find MM/YYYY or "Current"
        const parts = exp.duration.match(/(\d{2}\/\d{4}|Current)/gi);

        if (parts && parts.length === 2) {
            const start = parseDate(parts[0]);
            const end = parts[1]?.toLowerCase() === 'current' ? now : parseDate(parts[1]!!);

            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            totalMonths += Math.max(0, months);
        }
    });

    return totalMonths;
}

function parseDate(dateStr: string): Date {
    const [month, year] = dateStr.split('/').map(Number);
    return new Date(year || 0, (month || 1) - 1);
}


function getMatches(categoryList: string[], resumeText: string, jdText: string) {
    const normalize = (s: string) =>
        s.toLowerCase().replace(/[^\w\s+#.-]/g, "").trim();

    const containsKeyword = (text: string, keyword: string) => {
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`\\b${escaped}\\b`, "i");
        return regex.test(text);
    };

    const normalizedResume = normalize(resumeText);
    const normalizedJD = normalize(jdText);

    const relevantInJD = categoryList.filter(k =>
        containsKeyword(jdText, k) ||
        containsKeyword(normalizedJD, normalize(k))
    );

    if (relevantInJD.length === 0) {
        return { matched: [], missing: [], score: 100 };
    }

    const matched = relevantInJD.filter(k =>
        containsKeyword(resumeText, k) ||
        containsKeyword(normalizedResume, normalize(k))
    );

    const missing = relevantInJD.filter(k => !matched.includes(k));

    return {
        matched,
        missing,
        score: Math.round((matched.length / relevantInJD.length) * 100)
    };
}
