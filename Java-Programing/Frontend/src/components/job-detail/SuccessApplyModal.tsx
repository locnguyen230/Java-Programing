import React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface SuccessApplyModalProps {
  open: boolean;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export default function SuccessApplyModal({
  open,
  title = "Ứng tuyển thành công!",
  message = "Nhà tuyển dụng đã nhận được hồ sơ của bạn.",
  isLoading = false,
}: SuccessApplyModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
      <div
        className={cn(
          "w-full max-w-md bg-white border-2 border-gray-100 rounded-[2rem] shadow-2xl p-6",
          "animate-[bounceIn_0.45s_ease-out]"
        )}
        role="dialog"
        aria-modal="true"
      >
        <style>{`
          @keyframes bounceIn {
            0% { transform: scale(0.92) translateY(10px); opacity: 0; }
            60% { transform: scale(1.02) translateY(-4px); opacity: 1; }
            100% { transform: scale(1) translateY(0px); opacity: 1; }
          }
        `}</style>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-[1.75rem] bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            )}
          </div>

          <div className="min-w-0">
            <div className="text-2xl font-black text-secondary leading-tight">
              {title}
            </div>
            <div className="text-sm font-bold text-gray-500 leading-relaxed mt-1">
              {message}
            </div>
          </div>
        </div>

        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div className="h-full w-2/3 bg-emerald-500 rounded-full animate-[fillPulse_1.2s_ease-in-out_infinite]" />
        </div>

        <style>{`
          @keyframes fillPulse {
            0% { transform: translateX(-10%); opacity: .7; }
            50% { transform: translateX(10%); opacity: 1; }
            100% { transform: translateX(-10%); opacity: .7; }
          }
        `}</style>
      </div>
    </div>
  );
}
