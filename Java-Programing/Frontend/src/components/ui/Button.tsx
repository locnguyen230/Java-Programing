import React from "react";
import { cn } from "../../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "vip";
  size?: "sm" | "md" | "lg" | "xl";
};

export default function Button({ 
  variant = "primary", 
  size = "md", 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-white hover:bg-black shadow-lg shadow-secondary/10",
    outline: "bg-transparent border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
    vip: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/30 hover:scale-[1.03]"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
    xl: "px-10 py-5 text-lg"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
