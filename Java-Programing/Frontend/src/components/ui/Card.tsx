import React from "react";
import { cn } from "../../lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverable?: boolean;
};

export default function Card({ children, className, hoverable = true, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300",
        hoverable && "hover:shadow-xl hover:-translate-y-1 hover:border-primary/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
