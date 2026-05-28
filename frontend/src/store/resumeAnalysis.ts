import { create } from "zustand";
import type { ResumeAnalysisState } from "@/interfaces/resumeAnalysisInterfaces";
import { uploadFileWithJD } from "@/services/uploadService";

export const useResumeAnalysisStore = create<ResumeAnalysisState>((set) => ({
  atsResult: null,
  loading: false,
  error: null,
  analyzeResume: async (resumeData, jd) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call to backend for resume analysis
      const response = await uploadFileWithJD(resumeData as unknown as File, jd);

      if (response?.status < 200 || response?.status >= 300) {
        throw new Error("Failed to analyze resume");
      }

      const data = response.data;
      set({ atsResult: data.analysis, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unknown error", loading: false });
    }
  },

  resetUploadState: () => {
    set({ atsResult: null, error: null });
  }
}));