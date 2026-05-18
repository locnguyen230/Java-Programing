import React from "react";
import { User, GraduationCap, Users, Clock, Calendar, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/utils";
import Card from "../ui/Card";

interface JobSidebarProps {
  level: string;
  education: string;
  quantity: number;
  type: string;
  deadline: string;
  isVIP?: boolean;
}

export default function JobSidebar({ level, education, quantity, type, deadline, isVIP }: JobSidebarProps) {
  const info = [
    { label: "Cấp bậc", value: level, icon: User },
    { label: "Học vấn", value: education, icon: GraduationCap },
    { label: "Số lượng tuyển", value: `${quantity} người`, icon: Users },
    { label: "Hình thức", value: type, icon: Clock },
    { label: "Hạn nộp", value: deadline, icon: Calendar },
  ];

  return (
    <div className="space-y-6 sticky top-24">
      <Card className={cn(
        "p-8 shadow-xl shadow-secondary/5 transition-all duration-500",
        isVIP ? "border-yellow-200 ring-4 ring-yellow-400/5" : "border-gray-50"
      )}>
        {isVIP && (
          <div className="flex items-center gap-2 mb-8 px-4 py-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl text-yellow-700">
             <Sparkles className="w-4 h-4 animate-pulse fill-yellow-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-yellow-800">Tin tuyển dụng ưu tiên</span>
          </div>
        )}
        
        <h3 className="text-xl font-black text-secondary mb-8 tracking-tight flex items-center gap-2 uppercase">
          Thông tin chung
        </h3>
        
        <div className="space-y-8">
          {info.map((item, i) => (
            <div key={i} className="flex gap-4 items-start group">
              <div className={cn(
                "p-3 rounded-2xl transition-all group-hover:scale-110",
                isVIP ? "bg-yellow-50 text-yellow-600" : "bg-primary/5 text-primary"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="pt-1">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                <p className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100">
          <div className="bg-secondary/5 p-6 rounded-[2rem] border border-secondary/5 text-center relative overflow-hidden group hover:bg-secondary/10 transition-colors">
             <ShieldCheck className="absolute -top-4 -right-4 w-20 h-20 text-secondary/5 group-hover:text-secondary/10 transition-colors" />
             <p className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] mb-3 relative z-10">Thời hạn ứng tuyển</p>
             <p className="text-xs text-secondary font-bold leading-relaxed relative z-10">
               Hạn nộp hồ sơ trước ngày <span className="text-primary font-black block text-lg mt-1">{deadline}</span>
             </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-secondary to-gray-800 border-none">
        <h4 className="text-white font-black text-sm uppercase tracking-widest mb-4">Chia sẻ tin này</h4>
        <div className="flex gap-2">
          {['FB', 'LN', 'TW', 'CP'].map(social => (
            <button key={social} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-black transition-all flex items-center justify-center">
              {social}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
