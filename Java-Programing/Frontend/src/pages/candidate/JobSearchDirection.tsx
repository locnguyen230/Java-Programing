import React, { useMemo, useState } from "react";
import {
  Bot,
  Loader2,
  Sparkles,
  MapPin,
  GraduationCap,
  Briefcase,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import {
  getJobSearchDirection,
  SearchJobDirectionRequest,
  SearchJobDirectionResponse,
} from "../../services/aiService";

export default function JobSearchDirection() {
  const [targetCareer, setTargetCareer] = useState<string>("");
  const [currentProfile, setCurrentProfile] = useState<string>("");
  const [resumeText, setResumeText] = useState<string>("");
  const [currentSkills, setCurrentSkills] = useState<string>("");
  const [preferences, setPreferences] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ result, setResult] = useState<SearchJobDirectionResponse | null>(
    null
  );

  const parsedSkills = useMemo(() => {
    const raw = currentSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    // Deduplicate while keeping order
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of raw) {
      const key = s.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(s);
    }
    return out;
  }, [currentSkills]);

  const canSubmit = targetCareer.trim().length > 0 && !loading;

  const handleGenerate = async () => {
    if (!canSubmit) return;

    const payload: SearchJobDirectionRequest = {
      targetCareer: targetCareer.trim(),
      currentProfile: currentProfile.trim() || undefined,
      resumeText: resumeText.trim() || undefined,
      currentSkills: parsedSkills.length ? parsedSkills : undefined,
      preferences: preferences.trim() || undefined,
      location: location.trim() || undefined,
      experienceLevel: experienceLevel.trim() || undefined,
    };

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await getJobSearchDirection(payload);
      setResult(res.data ?? res); // handles ApiResponse wrapper shape defensively
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Không thể tạo phương hướng tìm việc lúc này.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10 px-4 flex justify-center">
      <div className="max-w-5xl w-full">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-secondary rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-secondary/20 border border-secondary/20">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-secondary tracking-tight">
              Phương hướng tìm việc
            </h1>
            <p className="text-gray-500 mt-1 font-bold">
              Nhập mục tiêu và nền tảng hiện tại, AI sẽ đề xuất hướng đi + từ
              khóa + filter gợi ý để bạn search job nhanh hơn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-secondary" />
              <h2 className="font-black text-secondary uppercase tracking-widest text-[12px]">
                Thông tin đầu vào
              </h2>
            </div>

            <div className="space-y-4">
              <Input
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                placeholder="Mục tiêu: ví dụ Java Backend Developer"
                label="Target nghề nghiệp *"
                icon={<Briefcase className="w-4 h-4" />}
              />

              <Input
                value={currentProfile}
                onChange={(e) => setCurrentProfile(e.target.value)}
                placeholder="Mô tả ngắn: bạn đang ở đâu (kinh nghiệm, dự án, điểm mạnh)..."
                label="Hiện trạng (optional)"
                icon={<GraduationCap className="w-4 h-4" />}
              />

              <Input
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder="Kỹ năng hiện có (phân tách bằng dấu ,) ví dụ: Java, Spring Boot, SQL"
                label="Current skills (optional)"
                icon={<Sparkles className="w-4 h-4" />}
              />

              <Input
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="Mong muốn: Remote, lương > 15tr, Junior/Mid..."
                label="Preferences (optional)"
                icon={<Sparkles className="w-4 h-4" />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (optional) ví dụ: HCM"
                  label="Location"
                  icon={<MapPin className="w-4 h-4" />}
                />
                <Input
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  placeholder="Level (optional) ví dụ: Junior"
                  label="Experience level"
                  icon={<GraduationCap className="w-4 h-4" />}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-2">
                  Resume text (optional)
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={6}
                  className="w-full rounded-[1rem] border-2 border-gray-100 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-sm"
                  placeholder="Dán nội dung CV ở mức bạn muốn AI phân tích (nếu có)."
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={!canSubmit}
                  className="w-full"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang tạo...
                    </span>
                  ) : (
                    "Tạo phương hướng"
                  )}
                </Button>
              </div>

              {error && (
                <div className="text-red-700 bg-red-50 border border-red-200 rounded-[1rem] p-3 font-bold">
                  {error}
                </div>
              )}

              <p className="text-gray-400 text-sm font-bold">
                Lưu ý: kết quả có thể là gợi ý. Bạn nên điều chỉnh theo tình
                hình thực tế của bản thân.
              </p>
            </div>
          </Card>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <h2 className="font-black text-secondary uppercase tracking-widest text-[12px]">
                    Kết quả đề xuất
                  </h2>
                </div>

                {!result && !loading && (
                  <div className="text-gray-500 font-bold">
                    Chưa có kết quả. Nhập thông tin ở cột trái và bấm{" "}
                    <span className="text-secondary font-black">
                      Tạo phương hướng
                    </span>
                    .
                  </div>
                )}

                {loading && (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                    <span className="font-bold text-gray-600">
                      Đang tạo lộ trình...
                    </span>
                  </div>
                )}

                {result && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-gray-500 text-sm font-bold">
                        Tóm tắt
                      </p>
                      <p className="text-secondary font-black mt-1">
                        {result.summary}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm font-bold">
                        Action plan (step-by-step)
                      </p>
                      <ol className="mt-2 space-y-2">
                        {result.actionPlan?.map((s, idx) => (
                          <li
                            key={idx}
                            className="bg-gray-50 border border-gray-100 rounded-[1rem] px-4 py-3 text-sm font-bold text-gray-800"
                          >
                            <span className="text-secondary font-black mr-2">
                              {idx + 1}.
                            </span>
                            {s}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm font-bold">
                        Recommended keywords
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(result.recommendedKeywords ?? []).map((k, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-2 rounded-full border-2 border-gray-100 bg-white text-secondary font-black text-xs"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    {result.filterSuggestion && (
                      <div>
                        <p className="text-gray-500 text-sm font-bold">
                          Filter suggestion
                        </p>

                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-white border-2 border-gray-100 rounded-[1rem] p-3">
                            <div className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                              Location
                            </div>
                            <div className="text-sm font-black text-gray-800 mt-1">
                              {result.filterSuggestion.location || "-"}
                            </div>
                          </div>

                          <div className="bg-white border-2 border-gray-100 rounded-[1rem] p-3">
                            <div className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                              Experience level
                            </div>
                            <div className="text-sm font-black text-gray-800 mt-1">
                              {result.filterSuggestion.experienceLevel || "-"}
                            </div>
                          </div>

                          <div className="bg-white border-2 border-gray-100 rounded-[1rem] p-3 sm:col-span-2">
                            <div className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                              Required skills
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {(result.filterSuggestion.requiredSkills ??
                                []
                              ).length ? (
                                (result.filterSuggestion.requiredSkills ?? []).map(
                                  (s, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-2 rounded-full border-2 border-gray-100 bg-gray-50 text-secondary font-black text-xs"
                                    >
                                      {s}
                                    </span>
                                  )
                                )
                              ) : (
                                <span className="text-sm font-bold text-gray-500">
                                  -
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
