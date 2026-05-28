import parsePDF from "../utils/pdfUtils/textFromPdf";

type LineType =
  | "contact"
  | "summary"
  | "skill"
  | "date"
  | "company"
  | "role"
  | "education"
  | "award"
  | "certification"
  | "url"
  | "unknown";

type ClassifiedLine = {
  text: string;
  type: LineType;
  score: number;
};

type Experience = {
  duration: string;
  details: string[];
};

export type ResumeSection = {
  summary: string[];
  skills: string[];
  experience: Experience[];
  education: string[];
  certifications: string[];
  awards: string[];
  contact: Record<string, string>;
};

export function universalResumeParser(rawText: string): ResumeSection {
  const lines = normalize(rawText);
  const classified = lines.map(classifyLine);
  return assembleSections(classified);
}

function normalize(text: string): string[] {
  return text
    .replace(/-- \d+ of \d+ --/g, "")
    .replace(/\t/g, " ")
    .split("\n")
    .map((line) =>
      line
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);
}

function classifyLine(line: string): ClassifiedLine {
  const patterns = [
    { type: "contact", regex: /\+?\d[\d\s-]{8,}/, score: 0.95 },
    { type: "contact", regex: /[^\s@]+@[^\s@]+\.[^\s@]+/, score: 0.95 },

    {
      type: "education",
      regex: /(bachelor|master|university|college|school|class|institute|vidhyalaya|academy|polytechnic)/i,
      score: 0.9,
    },

    {
      type: "date",
      regex: /\b\d{2}\/\d{4}\b/,
      score: 0.9,
    },

    {
      type: "url",
      regex: /https?:\/\/\S+/,
      score: 0.9,
    },

    {
      type: "award",
      regex: /(award|winner|recognition|excellence|hackathon)/i,
      score: 0.85,
    },

    {
      type: "certification",
      regex:
        /(certified|certificate|az-900|aws certification|azure certification)/i,
      score: 0.85,
    },

    {
      type: "skill",
      regex:
        /(javascript|typescript|react|node|express|aws|sql|python|mongodb|postgresql|angular|rest api|microservices|authentication|authorization|agile|architecture|scalable|testing|git|bitbucket|monitoring|framework|cloud|frontend|backend)/i,
      score: 0.8,
    },
  ];

  for (const p of patterns) {
    if (p.regex.test(line)) {
      return {
        text: line,
        type: p.type as LineType,
        score: p.score,
      };
    }
  }

  if (line.length > 120) {
    return { text: line, type: "summary", score: 0.7 };
  }

  return { text: line, type: "unknown", score: 0.3 };
}

function assembleSections(lines: ClassifiedLine[]): ResumeSection {
  const result: ResumeSection = {
    summary: [],
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    awards: [],
    contact: {},
  };

  let currentExperience: Experience | null = null;
  let experienceStarted = false;

  for (const line of lines) {
    if (isSectionHeader(line.text)) continue;

    switch (line.type) {
      case "contact": {
        const emailMatch = line.text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
        const phoneMatch = line.text.match(/\+?\d[\d\s-]{8,}/);

        if (emailMatch) result.contact.email = emailMatch[0];
        if (phoneMatch) result.contact.phone = phoneMatch[0].trim();
        break;
      }

      case "url":
        if (/linkedin/i.test(line.text)) {
          result.contact.linkedin = line.text;
        } else if (/github/i.test(line.text)) {
          result.contact.github = line.text;
        }
        break;

      case "date":
        experienceStarted = true;

        if (currentExperience) {
          result.experience.push(currentExperience);
        }

        currentExperience = {
          duration: line.text,
          details: [],
        };
        break;

      case "education":
        result.education.push(line.text);
        break;

      case "certification":
        result.certifications.push(line.text);
        break;

      case "award":
        result.awards.push(line.text);
        break;

      case "skill":
        if (!experienceStarted) {
          result.skills.push(line.text);
        } else if (currentExperience) {
          currentExperience.details.push(line.text);
        }
        break;

      case "summary":
      case "unknown":
        if (!experienceStarted) {
          if (!isHeading(line.text)) {
            result.summary.push(line.text);
          }
        } else if (currentExperience) {
          currentExperience.details.push(line.text);
        }
        break;
    }
  }

  if (currentExperience) {
    result.experience.push(currentExperience);
  }

  // cleanup misplaced content
  cleanupSections(result);

  return result;
}

function cleanupSections(result: ResumeSection) {
  // move misplaced skills from summary
  const recoveredSkills: string[] = [];
  const cleanedSummary: string[] = [];

  for (const line of result.summary) {
    if (
      /(rest api|microservices|authentication|authorization|agile|architecture|scalable|framework)/i.test(
        line
      )
    ) {
      recoveredSkills.push(line);
    } else {
      cleanedSummary.push(line);
    }
  }

  result.summary = cleanedSummary;
  result.skills.push(...recoveredSkills);

  // clean experience junk
  result.experience = result.experience.map((exp) => ({
    ...exp,
    details: exp.details.filter(
      (d) =>
        !isSectionHeader(d) &&
        !/(bachelor|master|university|college|school|class|institute|vidhyalaya|academy|polytechnic)/i.test(d)
    ),
  }));

  // remove duplicates
  result.skills = [...new Set(result.skills)];
  result.education = [...new Set(result.education)];
  result.certifications = [...new Set(result.certifications)];
  result.awards = [...new Set(result.awards)];
}

function isHeading(text: string): boolean {
  return /^[A-Z\s,&]+$/.test(text);
}

function isSectionHeader(text: string): boolean {
  const headers = [
    "SUMMARY",
    "SKILLS",
    "EXPERIENCE",
    "EDUCATION",
    "WEBSITES, PORTFOLIOS, PROFILES",
    "CERTIFICATIONS",
    "AWARDS",
  ];

  return headers.includes(text.trim().toUpperCase());
}

const pdfParserService = {
  parseTextFromPDF: async (filePath: string) => {
    try {
      const text = await parsePDF(filePath);
      const categorizedData = universalResumeParser(text.text);
      return categorizedData;
    } catch (error) {
      console.error("Error in PDF parsing service:", error);
      throw error;
    }
  },
};

export default pdfParserService;