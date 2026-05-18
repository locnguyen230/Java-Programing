import api from "./api";

export const analyzeCV = async (text: string) => {
  const res = await api.post("/ai/analyze-cv", { text });
  return res.data;
};

export const getCareerAdvice = async (message: string) => {
  const res = await api.post("/ai/chat", { message });
  return res.data;
};

export type SearchJobDirectionResponse = {
  summary: string;
  actionPlan: string[];
  recommendedKeywords: string[];
  filterSuggestion?: {
    location?: string;
    experienceLevel?: string;
    remote?: boolean;
    employmentType?: string;
    minSalary?: number;
    maxSalary?: number;
    requiredSkills?: string[];
  };
};

export type SearchJobDirectionRequest = {
  targetCareer: string;
  currentProfile?: string;
  resumeText?: string;
  currentSkills?: string[];
  preferences?: string;
  location?: string;
  experienceLevel?: string;
};

export const getJobSearchDirection = async (payload: SearchJobDirectionRequest) => {
  const res = await api.post("/career/search-direction", payload);
  return res.data;
};
