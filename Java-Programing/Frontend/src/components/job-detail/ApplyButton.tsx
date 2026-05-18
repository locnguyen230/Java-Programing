import React from "react";
import { Send, Heart, Star, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";
import Button from "../ui/Button";

interface ApplyButtonProps {
  onApply: () => void;
  isVIP?: boolean;
  applied?: boolean;
}

export default function ApplyButton({ onApply, isVIP, applied }: ApplyButtonProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full">
      <Button
        onClick={onApply}
        disabled={!!applied}
        variant={applied ? "primary" : isVIP ? "vip" : "primary"}
        className={[
          "flex-grow py-5 px-8 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95",
          applied
            ? "bg-emerald-600 text-white border border-emerald-600 shadow-none hover:bg-emerald-600 cursor-not-allowed"
            : "disabled:opacity-70 disabled:shadow-none"
        ].join(" ")}
      >
        {!applied && isVIP && <Star className="w-5 h-5 fill-white animate-pulse" />}
        {applied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
        {applied ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
        ) : (
          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        )}
      </Button>

      <button className="px-8 py-5 rounded-[1.5rem] bg-white border-2 border-gray-100 text-gray-400 font-black text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3 group active:scale-95 shadow-sm">
        <Heart className="w-5 h-5 transition-colors group-hover:fill-primary" />
        Lưu tin
      </button>
    </div>
  );
}
