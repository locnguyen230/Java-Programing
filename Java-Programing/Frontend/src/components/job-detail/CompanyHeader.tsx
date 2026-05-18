import React from "react";
import { PlusCircle, CheckCircle2, Globe, Users } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";
import Button from "../ui/Button";

interface CompanyHeaderProps {
  company: string;
  logoColor?: string;
  isVIP?: boolean;
}

export default function CompanyHeader({ company, logoColor, isVIP }: CompanyHeaderProps) {
  return (
    <div className="relative mb-8">
      {/* Banner */}
      <div className={cn(
        "h-52 w-full rounded-t-[2.5rem] overflow-hidden relative",
        isVIP ? "bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-600/20" : "bg-secondary/5"
      )}>
        <img 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200" 
          className="w-full h-full object-cover opacity-40 mix-blend-multiply"
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="bg-white rounded-b-[2.5rem] px-8 py-8 shadow-xl shadow-secondary/5 border-x border-b border-gray-100 flex flex-col md:flex-row items-center md:items-center gap-8 -mt-16 relative z-10 mx-6">
        <div className={cn(
          "w-36 h-36 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl border-4 p-5 transition-transform hover:scale-105 duration-500",
          isVIP ? "border-yellow-400" : "border-white"
        )}>
           <div className="w-full h-full rounded-2xl flex items-center justify-center text-4xl font-black uppercase tracking-tighter" style={{ color: logoColor || '#FF3B3B', backgroundColor: (logoColor || '#FF3B3B') + '10' }}>
              {company.split(' ').map(w => w[0]).join('').slice(0, 3)}
           </div>
        </div>

        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
            <h1 className="text-3xl font-black text-secondary tracking-tight">{company}</h1>
            {isVIP && <CheckCircle2 className="text-primary w-6 h-6" />}
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
               <Users className="w-4 h-4" />
               <span>10,000+ Nhân viên</span>
            </div>
            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full hidden md:block self-center"></div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors cursor-pointer group">
               <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
               <span>Website công ty</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <Button variant="outline" className="flex-grow md:flex-initial rounded-2xl py-4 px-8 border-2 font-black uppercase tracking-widest text-xs">
            Theo dõi
          </Button>
          <Button variant={isVIP ? "vip" : "primary"} className="flex-grow md:flex-initial rounded-2xl py-4 px-8 shadow-xl font-black uppercase tracking-widest text-xs">
            <PlusCircle className="w-4 h-4" /> Tuyển dụng
          </Button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="mx-6 mt-8 flex gap-12 px-10 border-b border-gray-100 overflow-x-auto no-scrollbar">
         {['Trang chủ', 'Tin tuyển dụng', 'Văn hóa công ty', 'Đánh giá'].map((tab, idx) => (
           <button 
             key={tab}
             className={cn(
               "pb-5 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap relative group",
               idx === 1 ? "text-primary" : "text-gray-400 hover:text-secondary"
             )}
           >
             {tab}
             {idx === 1 && (
               <motion.div 
                 layoutId="activeTab"
                 className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
               />
             )}
           </button>
         ))}
      </div>
    </div>
  );
}
