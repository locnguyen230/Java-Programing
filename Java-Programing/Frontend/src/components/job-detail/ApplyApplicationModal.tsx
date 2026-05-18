import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { cn } from "../../lib/utils";
import { submitApplication, ApplicationSubmissionRequest } from "../../services/applicationService";
import SuccessApplyModal from "./SuccessApplyModal.tsx";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

interface ApplyApplicationModalProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle?: string;
  companyName?: string;
  onApplied?: () => void;
}

type FieldErrors = Partial<Record<keyof ApplicationSubmissionRequest, string>> & {
  cvUrl?: string;
};

export default function ApplyApplicationModal({
  open,
  onClose,
  jobId,
  jobTitle,
  companyName,
}: ApplyApplicationModalProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [form, setForm] = useState<ApplicationSubmissionRequest>({
    fullName: "",
    email: "",
    phoneNumber: "",
    cvUrl: "",
    coverLetter: "",
    jobId,
  });

  useEffect(() => {
    if (!open) return;

    setForm((prev) => ({
      ...prev,
      jobId,
      fullName: user?.name ?? prev.fullName,
      email: user?.email ?? prev.email,
      phoneNumber: prev.phoneNumber,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, jobId, user?.email, user?.name]);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const [retryKey, setRetryKey] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const titleText = useMemo(() => {
    if (!jobTitle && !companyName) return "Ứng tuyển ngay";
    return `Ứng tuyển: ${jobTitle || "Job"}${companyName ? ` • ${companyName}` : ""}`;
  }, [jobTitle, companyName]);

  const validate = () => {
    const errs: FieldErrors = {};

    if (!form.cvUrl?.trim()) errs.cvUrl = "Vui lòng nhập URL CV (bắt buộc).";
    if (!form.fullName?.trim()) errs.fullName = "Họ và tên là bắt buộc.";
    if (!form.email?.trim()) errs.email = "Email là bắt buộc.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email không hợp lệ.";
    if (!form.phoneNumber?.trim()) errs.phoneNumber = "Số điện thoại là bắt buộc.";

    // coverLetter optional
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setShowSuccess(false);

    const ok = validate();
    if (!ok) {
      toast.error("Vui lòng kiểm tra lại thông tin bắt buộc.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const res = await submitApplication(form);
      if (!res?.success) throw new Error(res?.message || "Submit failed");

      toast.success("Ứng tuyển thành công!");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        navigate("/notifications");
      }, 2000);
    } catch (e: any) {
      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Gửi hồ sơ thất bại. Vui lòng thử lại.";

      // If user already applied -> treat as a "success" UX (mock server returns 409)
      const isDuplicate =
        status === 409 ||
        (typeof msg === "string" && msg.toLowerCase().includes("duplicate"));

      if (isDuplicate) {
        const friendly = "Bạn đã nộp hồ sơ cho vị trí này trước đó.";
        toast.message(friendly);

        setFieldErrors({});
        setSubmitError(null);

        setTimeout(() => {
          onClose();
          navigate("/notifications");
        }, 1200);

        return;
      }

      toast.error(msg);
      setFieldErrors({});
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
      setRetryKey((v) => v + 1);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-[2.5rem] border-2 border-gray-100 shadow-2xl p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h2 className="text-2xl md:text-3xl font-black text-secondary leading-tight">
                {titleText}
              </h2>
              <p className="text-gray-500 font-bold mt-2">
                Điền đầy đủ thông tin bắt buộc để nộp hồ sơ.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border-2 border-gray-100 hover:border-gray-300 active:scale-95"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[1.75rem] bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center">
                <Send className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black text-gray-900 uppercase tracking-widest">
                  Hồ sơ yêu cầu
                </div>
                <div className="text-gray-600 font-bold text-sm mt-1">
                  CV (bắt buộc) + Họ tên + Email + SĐT
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 font-sans">
                CV URL <span className="text-red-600">*</span>
              </label>
              <input
                value={form.cvUrl}
                onChange={(e) => setForm((f) => ({ ...f, cvUrl: e.target.value }))}
                placeholder="https://... (bắt buộc)"
                className={cn(
                  "mt-2 w-full px-4 py-3 rounded-2xl border-2 outline-none font-bold",
                  fieldErrors.cvUrl ? "border-red-400 bg-red-50" : "border-gray-100"
                )}
              />
              {fieldErrors.cvUrl && (
                <p className="mt-2 text-red-700 font-bold text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.cvUrl}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 font-sans">
                Họ và tên <span className="text-red-600">*</span>
              </label>
              <Input
                className={cn(fieldErrors.fullName ? "border-red-400" : "")}
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="Nguyễn Văn A"
              />
              {fieldErrors.fullName && (
                <p className="mt-2 text-red-700 font-bold text-sm">{fieldErrors.fullName}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 font-sans">
                Email <span className="text-red-600">*</span>
              </label>
              <Input
                className={cn(fieldErrors.email ? "border-red-400" : "")}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@gmail.com"
              />
              {fieldErrors.email && (
                <p className="mt-2 text-red-700 font-bold text-sm">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 font-sans">
                Số điện thoại <span className="text-red-600">*</span>
              </label>
              <Input
                className={cn(fieldErrors.phoneNumber ? "border-red-400" : "")}
                value={form.phoneNumber}
                onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                placeholder="090xxxxxxx"
              />
              {fieldErrors.phoneNumber && (
                <p className="mt-2 text-red-700 font-bold text-sm">{fieldErrors.phoneNumber}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 font-sans">
                Cover letter (optional)
              </label>
              <textarea
                value={form.coverLetter || ""}
                onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
                className="mt-2 w-full px-4 py-3 rounded-2xl border-2 border-gray-100 outline-none font-bold min-h-[90px]"
                placeholder="Nhắn nhà tuyển dụng (nếu muốn)"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 items-stretch">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-secondary/10"
              variant="primary"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang nộp...
                </span>
              ) : (
                "Nộp hồ sơ"
              )}
            </Button>

            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black uppercase tracking-widest hover:border-gray-300 active:scale-95 disabled:opacity-60"
            >
              Hủy
            </button>
          </div>

          {submitError && (
            <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-[2rem] p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
                <div className="min-w-0">
                  <div className="font-black text-red-900">Nộp hồ sơ không thành công</div>
                  <div className="text-red-700 font-bold mt-1 break-words">{submitError}</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 text-xs font-bold text-gray-400 leading-relaxed">
            Lưu ý: hiện tại bạn cần cung cấp <span className="text-gray-700">CV URL</span> để hệ thống lưu `cvUrl`.
          </div>
        </div>
      </div>

      <SuccessApplyModal open={showSuccess} isLoading={false} />
    </>
  );
}
