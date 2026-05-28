import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { Progress } from "@/components/ui/progress";
  import { Button } from "@/components/ui/button";
  import { CheckCircle2, AlertTriangle, FileText } from "lucide-react";
  import { useResumeAnalysisStore } from "@/store/resumeAnalysis";
  
  export default function ResumeAnalysisPage({setJd}: {setJd: (jd: string) => void}) {
    const { resetUploadState, atsResult } = useResumeAnalysisStore();
    const atsEngine = atsResult.atsScore;
    const aiAnalysis = atsResult.analysis;
    const finalScore = atsResult.finalScore || 0;
    const scoreMessage = atsResult.scoreMessage;

    const handleUpload = () => {
        setJd("");
        resetUploadState();
    }

    return (
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="border-b bg-background sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-blue-600">
              AI Resume Intelligence
            </h1>
            <Button onClick={handleUpload} className="text-white border bg-blue-600 hover:bg-blue-700">Check Another</Button>
          </div>
        </header>
  
        <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
          {/* Hero Section */}
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Resume Analysis Result
                </p>
                <h2 className="text-4xl font-bold mt-2 text-blue-600">{scoreMessage.keyword}</h2>
                <p className="text-muted-foreground mt-3 max-w-xl">
                  {scoreMessage.line}
                </p>
              </div>
  
              <div className="w-36 h-36 rounded-full border-8 border-primary border-blue-600 flex items-center justify-center text-4xl font-bold">
                {finalScore || 0}%
              </div>
            </CardContent>
          </Card>
  
          {/* Score Overview */}
          <section className="grid md:grid-cols-3 gap-6">
            {[
              { title: "ATS Score", value: aiAnalysis.ats_score, suffix: "%" },
              { title: "JD Match", value: aiAnalysis.jd_match_score, suffix: "%" },
              { title: "Experience", value: atsEngine.totalExperience, suffix: " yrs" },
            ].map((item) => (
              <Card key={item.title} className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-blue-600">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {item.value}
                    {item.suffix || "%"}
                  </div>
                  {item.title !== "Experience" && (
                    <Progress value={item.value} className="mt-4" />
                  )}
                </CardContent>
              </Card>
            ))}
          </section>
  
          {/* Keywords */}
          <section className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-blue-600">Matched Keywords</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {atsEngine.matchedKeywords.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag.toUpperCase()}
                  </Badge>
                ))}
              </CardContent>
            </Card>
  
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-blue-600">Missing Keywords</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {aiAnalysis.missing_keywords.map((tag) => (
                  <Badge key={tag} variant="destructive">
                    {tag.toUpperCase()}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </section>
  
          {/* Strengths & Weaknesses */}
          <section className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-blue-600">Strengths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiAnalysis.strengths.map((point) => (
                  <div key={point} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                    <p>{point}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
  
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-blue-600">Improvement Areas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiAnalysis.weaknesses.map((point) => (
                  <div key={point} className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                    <p>{point}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
  
          {/* Resume Improvements */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-blue-600">Resume Bullet Improvements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-xl p-5">
                <p className="text-sm text-muted-foreground text-blue-600">Original</p>
                {aiAnalysis.improved_bullets.map((item, index) => (
                    <div key={index} className="flex gap-3 mt-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                        <p>{item.original}</p>
                    </div>
                ))}
              </div>

              <div className="border rounded-xl p-5">
              <p className="text-sm text-muted-foreground text-blue-600">Improved</p>
              {aiAnalysis.improved_bullets.map((item, index) => {
                return (
                    <div key={index} className="flex gap-3 mt-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                        <p>{item.improved}</p>
                    </div>
                )
              })}
              </div>
            </CardContent>
          </Card>
  
          {/* Summary */}
          <Card className="rounded-3xl bg-primary text-primary-foreground">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6" />
                <h3 className="text-2xl font-semibold text-blue-600">AI Summary</h3>
              </div>
  
              <p className="leading-relaxed opacity-90">
                {aiAnalysis.summary}
              </p>
  
              {/* <Button
                variant="secondary"
                className="mt-6 rounded-xl font-semibold"
              >
                Download Optimized Resume
              </Button> */}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }