import React, { useMemo, useState } from "react";
import { Upload, FileText, Sparkles, Save, Loader2, Rocket, CheckCircle2 } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { toast } from "sonner";
import VIPGuard from "../../components/VIPGuard";
import { createEmployerJob, publishEmployerJob } from "../../services/recruiterService";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "../../store/useAuthStore";

export type GeneratedRecruitmentPost = {
  title: string;
  description: string;
  requirements: string;
  skills: string[];
  location?: string;
  experience?: string;
  employmentType?: string;
  minSalary?: number;
  maxSalary?: number;

  jobId?: string;
  status?: string;
};

const sanitizeCsvSkills = (skills: string[]) =>
  (skills ?? [])
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");

const toEnumOrUndefined = (v?: string) =>
  v && v.trim() ? v.trim().toUpperCase() : undefined;

type SuccessKind = "DRAFT_SAVED" | "PUBLISHED";

export default function JobComposer() {
  const { isVIP } = useAuthStore();

  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const [generated, setGenerated] = useState<GeneratedRecruitmentPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [savedJobId, setSavedJobId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const [successKind, setSuccessKind] = useState<SuccessKind | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [skills, setSkills] = useState("");

  // Optional recruiter hints
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  const canGenerate = useMemo(() => !!file && !busy, [file, busy]);

  const resetToGenerated = (g: GeneratedRecruitmentPost) => {
    setTitle(g.title ?? "");
    setDescription(g.description ?? "");
    setRequirements(g.requirements ?? "");
    setSkills(sanitizeCsvSkills(g.skills ?? []));
  };

  const onGenerate = async () => {
    if (!file) return;

    try {
      setError(null);
      setBusy(true);

      const form = new FormData();
      form.append("file", file);

      // hints are optional; only append if non-empty to reduce Gemini noise
      if (location.trim()) form.append("location", location.trim());
      if (experience.trim()) form.append("experience", experience.trim().toUpperCase());
      if (employmentType.trim()) form.append("employmentType", employmentType.trim().toUpperCase());
      if (minSalary.trim()) form.append("minSalary", minSalary.trim());
      if (maxSalary.trim()) form.append("maxSalary", maxSalary.trim());

      const res = await fetch("/api/ai/recruitment-post/upload", {
        method: "POST",
        body: form,
      });

      const body = await res.json();

      if (!res.ok || body?.success === false) {
        throw new Error(body?.message ?? "Failed to generate recruitment post");
      }

      const data = body?.data as GeneratedRecruitmentPost;
      setGenerated(data);
      setSavedJobId(null);
      resetToGenerated(data);
      toast.success("Đã tạo nội dung tuyển dụng từ tài liệu");
    } catch (e: any) {
      setError(e?.message ?? "Generate failed");
      toast.error(e?.message ?? "Không thể tạo nội dung");
    } finally {
      setBusy(false);
    }
  };

  const onSave = async () => {
    try {
      if (!title.trim() || !description.trim() || !requirements.trim()) {
        toast.error("Vui lòng điền đủ Title / Description / Requirements trước khi lưu");
        return;
      }

      setBusy(true);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        requirements: requirements.trim(),

        location: location.trim() ? location.trim() : generated?.location ?? "",
        experience:
          toEnumOrUndefined(experience) ??
          (generated?.experience ? toEnumOrUndefined(generated.experience) : undefined),
        employmentType:
          toEnumOrUndefined(employmentType) ??
          (generated?.employmentType
            ? toEnumOrUndefined(generated.employmentType)
            : undefined),

        minSalary: minSalary.trim() ? Number(minSalary) : (generated?.minSalary ?? null),
        maxSalary: maxSalary.trim() ? Number(maxSalary) : (generated?.maxSalary ?? null),

        // backend stores skills as CSV string
        skills: skills.trim()
          ? skills.trim()
          : sanitizeCsvSkills(generated?.skills ?? []),

        status: "DRAFT",
        deleted: false,
        featured: false,
      };

      const res: any = await createEmployerJob(payload as any);
      const savedId: string | undefined = res?.id ?? res?.jobId ?? res?.data?.id;

      if (savedId) setSavedJobId(savedId);

      setSuccessKind("DRAFT_SAVED");
      toast.success("Đã lưu tin tuyển dụng (DRAFT)");
    } catch (e: any) {
      toast.error(e?.message ?? "Không thể lưu tin tuyển dụng");
    } finally {
      setBusy(false);
    }
  };

  const onPublish = async () => {
    if (!savedJobId) return;

    try {
      setPublishing(true);
      await publishEmployerJob(savedJobId);
      setSuccessKind("PUBLISHED");
      toast.success("Đã đăng tin tuyển dụng (PUBLISHED)");
    } catch (e: any) {
      toast.error(e?.message ?? "Không thể publish tin tuyển dụng");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Modal */}
      <AnimatePresence>
        {successKind && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSuccessKind(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
            >
              <div
                className={
                  isVIP
                    ? "h-28 bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center relative"
                    : "h-28 bg-emerald-600 flex items-center justify-center relative"
                }
              >
                <motion.div
                  className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-20"
                  animate={isVIP ? { rotate: 360 } : { opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 1.2, repeat: isVIP ? Infinity : 0, ease: "easeInOut" }}
                />
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>

              <div className="p-8">
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-black text-secondary uppercase tracking-widest">
                    {successKind === "DRAFT_SAVED" ? "Saved Draft" : "Published!"}
                  </h2>
                  <p className="text-gray-500 font-bold">
                    {successKind === "DRAFT_SAVED"
                      ? "Your job is now saved as a draft. You can edit and publish anytime."
                      : "Your job is now live. Candidates can see it instantly on their recruitment page."}
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 font-black uppercase tracking-widest text-xs transition border border-gray-200"
                    onClick={() => setSuccessKind(null)}
                  >
                    Close
                  </button>

                  <button
                    className={
                      isVIP
                        ? "flex-1 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:scale-[1.02] transition font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-600/20"
                        : "flex-1 py-3 rounded-2xl bg-emerald-600 text-white hover:scale-[1.02] transition font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-600/20"
                    }
                    onClick={() => setSuccessKind(null)}
                  >
                    Done
                  </button>
                </div>

                {isVIP ? (
                  <div className="mt-4 text-center">
                    <VIPGuard fallback={null}>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-yellow-200 bg-yellow-50 text-yellow-700 font-black text-[11px] uppercase tracking-widest">
                        <span className="inline-block w-2.5 h-2.5 bg-yellow-600 rounded-full" />
                        VIP animation unlocked
                      </div>
                    </VIPGuard>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-secondary tracking-tighter mb-2 uppercase">
            Job Composer (AI)
          </h1>
          <p className="text-gray-400 font-medium italic">
            Upload PDF/DOCX → tự tạo bài tuyển dụng → bạn chỉnh sửa → lưu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-5 space-y-6">
          <Card className="p-6 shadow-xl shadow-secondary/5 border-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-secondary uppercase tracking-widest">
                Upload tài liệu
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full"
              />

              <div className="text-[12px] font-bold text-gray-400">
                Tên file: {file?.name ?? "Chưa chọn"}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  className="rounded-2xl px-5 py-3 shadow-xl shadow-primary/20 font-black text-xs uppercase tracking-widest gap-2"
                  onClick={onGenerate}
                  disabled={!canGenerate}
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Tạo nội dung
                </Button>

                <Button
                  variant="outline"
                  className="rounded-2xl px-5 py-3 border-2 border-gray-200"
                  disabled={busy}
                  onClick={() => {
                    setGenerated(null);
                    setSavedJobId(null);
                    setTitle("");
                    setDescription("");
                    setRequirements("");
                    setSkills("");
                    setError(null);
                  }}
                >
                  Reset
                </Button>
              </div>

              {error && <div className="text-red-600 text-sm font-black">{error}</div>}
            </div>
          </Card>

          <Card className="p-6 shadow-xl shadow-secondary/5 border-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-secondary uppercase tracking-widest">
                Gợi ý bổ sung (tuỳ chọn)
              </h2>
            </div>

            <div className="space-y-3">
              <label className="block">
                <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Location
                </div>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold"
                />
              </label>

              <label className="block">
                <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Experience (FRESHER/JUNIOR/MID/SENIOR)
                </div>
                <input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold"
                />
              </label>

              <label className="block">
                <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  EmploymentType (FULL_TIME/.../REMOTE)
                </div>
                <input
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                    Min Salary
                  </div>
                  <input
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold"
                  />
                </label>
                <label className="block">
                  <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                    Max Salary
                  </div>
                  <input
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold"
                  />
                </label>
              </div>
            </div>
          </Card>
        </div>

        <div className="xl:col-span-7 space-y-6">
          <Card className="p-6 shadow-xl shadow-secondary/5 border-gray-50">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-black text-secondary uppercase tracking-widest">
                  Preview & Edit
                </h2>
                <p className="text-sm font-bold text-gray-400">Chỉnh lại nội dung trước khi lưu.</p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="vip"
                  className="rounded-2xl px-6 py-3 shadow-xl shadow-primary/20 font-black text-xs uppercase tracking-widest gap-2"
                  onClick={onSave}
                  disabled={busy || !title.trim()}
                >
                  <Save className="w-4 h-4" />
                  Lưu DRAFT
                </Button>

                <Button
                  variant="primary"
                  className="rounded-2xl px-6 py-3 shadow-xl shadow-secondary/20 font-black text-xs uppercase tracking-widest gap-2"
                  onClick={onPublish}
                  disabled={busy || publishing || !savedJobId}
                >
                  <Rocket className="w-4 h-4" />
                  Publish
                </Button>
              </div>
            </div>

            {/* Generated preview panel */}
            {generated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-[2rem] border-2 border-gray-50 bg-gray-50 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Preview from AI
                    </p>
                    <h3 className="text-xl font-black text-secondary">{generated.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Status
                    </div>
                    <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">
                        Editable
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 font-bold text-sm line-clamp-3">{generated.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(generated.skills ?? []).slice(0, 6).map((s, idx) => (
                    <span key={`${s}-${idx}`} className="px-3 py-1 rounded-full bg-white border border-gray-200 text-[11px] font-black text-gray-700 uppercase tracking-widest">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              <label className="block">
                <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Title
                </div>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold"
                />
              </label>

              <label className="block">
                <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Description
                </div>
                <textarea
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold resize-y"
                />
              </label>

              <label className="block">
                <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Requirements
                </div>
                <textarea
                  rows={8}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold resize-y"
                />
              </label>

              <label className="block">
                <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Skills (CSV)
                </div>
                <input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold"
                />
              </label>

              {!generated && (
                <div className="text-gray-500 font-bold text-center py-10">
                  Chưa có nội dung. Hãy upload PDF/DOCX để tạo bài tuyển dụng.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
