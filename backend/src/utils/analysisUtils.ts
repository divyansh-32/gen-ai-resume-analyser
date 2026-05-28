function getScoreMessage(finalScore: number) {
    if (finalScore >= 90) {
      return {
        keyword: "Outstanding Match",
        line: "Your resume is highly optimized and strongly aligned with the job description."
      };
    }
  
    if (finalScore >= 80) {
      return {
        keyword: "Strong Match",
        line: "Your resume performs well and has a competitive fit for this role."
      };
    }
  
    if (finalScore >= 70) {
      return {
        keyword: "Good Potential",
        line: "Your resume shows promise, but a few targeted improvements can boost your chances."
      };
    }
  
    if (finalScore >= 60) {
      return {
        keyword: "Needs Improvement",
        line: "Your resume has relevant strengths, but significant optimization is recommended."
      };
    }
  
    return {
      keyword: "Low Match",
      line: "Your resume requires substantial refinement to align with this opportunity."
    };
  }

export { getScoreMessage };