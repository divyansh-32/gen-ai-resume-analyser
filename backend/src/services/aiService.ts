import pdfParserService from "./pdfParserService";
import { ATSScorer } from "./atsScorer";
// import { GoogleGenAI } from "@google/genai";
import { getResumeAnalysisPrompt } from "../prompts/resumeAnalysisPrompts";
import { getScoreMessage } from "../utils/analysisUtils";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});


const aiService = {
    analyzeResume: async (resumePath: string, jdText: string) => {
        const parsedResume = await pdfParserService.parseTextFromPDF(resumePath);
        const atsScore = ATSScorer(parsedResume, jdText);
        const resumeAnalysisPrompt = getResumeAnalysisPrompt(parsedResume, jdText, atsScore);
        const genAIResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "assistant", content: resumeAnalysisPrompt }
            ],
            temperature: 0.2
          });

        const message = genAIResponse?.choices[0]?.message  
        const analysis = JSON.parse(message?.content || "{}");

        const finalScore = Math.round(
            atsScore.atsScore * 0.6 + analysis.jd_match_score * 0.4 
          );

        const scoreMessage = getScoreMessage(finalScore);

        return {
            finalScore,
            scoreMessage,
            atsScore,
            analysis
        };
    }
}

export default aiService;