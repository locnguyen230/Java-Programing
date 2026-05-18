import React from "react";
import { cn } from "../../lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "primary" | "success" | "warning" | "vip";
};

export default function Badge({ children, variant = "default", className, ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-600",
    primary: "bg-red-50 text-primary border border-primary/10",
    success: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    warning: "bg-orange-50 text-orange-600 border border-orange-100",
    vip: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-sm"
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
