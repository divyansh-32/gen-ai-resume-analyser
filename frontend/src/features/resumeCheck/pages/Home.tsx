// src/features/pages/Home.tsx
import Login from "@/features/auth/pages/login";
import Header from "../../../components/Header";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ResumeAnalysisPage from "./resumeAnalysis";
import { useResumeAnalysisStore } from "@/store/resumeAnalysis";

function Home() {

  const [jd, setJd] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [checkResumeDisabled, setCheckResumeDisabled] = useState(true);
  const {isAuthenticated} = useAuthStore();
  const {analyzeResume, atsResult} = useResumeAnalysisStore();

  if(!jd || !file) {
    if(!checkResumeDisabled) setCheckResumeDisabled(true);
  } else {
    if(checkResumeDisabled) setCheckResumeDisabled(false);
  }

  const handleSubmit = () => {
    analyzeResume(file!, jd);
  };

  if (!isAuthenticated) return <Login />;

  return (
    <>
    <Header />
    {!atsResult?.atsScore ? (<div>

      <div className="flex justify-center mt-10 px-4">
        <Card className="w-full max-w-3xl p-6 space-y-6 shadow-md">
          
          <h1 className="text-2xl font-bold text-center">
            Check Your Resume
          </h1>

          {/* JD Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Paste Job Description
            </label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-40 border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Upload Resume
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
              className="block w-full text-sm text-gray-600
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-medium
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
          </div>

          {/* Submit */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSubmit}
            disabled={checkResumeDisabled}
          >
            Check Resume
          </Button>
        </Card>
      </div>
    </div>) : 
    <ResumeAnalysisPage setJd={setJd}></ResumeAnalysisPage>}
    </>
  );
}

export default Home;