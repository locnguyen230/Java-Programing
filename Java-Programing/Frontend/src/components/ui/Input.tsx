import React from "react";
import { cn } from "../../lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
};

export default function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 placeholder:text-gray-400 font-medium",
            icon && "pl-12",
            error && "border-primary ring-4 ring-primary/5",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-primary ml-1">{error}</p>}
    </div>
  );
}
