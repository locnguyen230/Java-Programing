import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { User as UserIcon, Mail, Briefcase, Star, BadgeCheck, Shield, Edit3, Settings, Trophy, Zap, Clock, Key, Sparkles, MapPin, Share2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function Profile() {
  const { user, isVIP, vipType, vipExpireDate } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  const currentBadges = user.badges || ["Java Pioneer", "AI Apprentice"];

  const stats = [
    { label: "Việc đã nộp", value: 12, icon: Briefcase, color: "text-primary", bg: "bg-primary/5" },
    { label: "Điểm CV", value: 87, icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "AI Consults", value: 45, icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Kỹ năng", value: 450, icon: Star, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="pb-24 bg-[#F9FAFB] min-h-screen font-sans">
      {/* Header Banner */}
      <div className={cn(
        "h-64 md:h-80 transition-all duration-700 relative overflow-hidden",
        isVIP ? "bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700" : "bg-secondary"
      )}>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
           <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Banner" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Info Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="p-8 shadow-2xl shadow-secondary/10 border-white flex flex-col items-center text-center">
              <div className={cn(
                "w-44 h-44 rounded-[2.5rem] p-1.5 shadow-2xl relative group mb-8 transition-transform duration-500 hover:scale-105",
                isVIP ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : "bg-primary"
              )}>
                <div className="w-full h-full rounded-[2.2rem] bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-inner">
                  <UserIcon className={cn("w-20 h-20", isVIP ? "text-yellow-600" : "text-primary")} />
                </div>
                {isVIP && (
                   <div className="absolute -top-3 -right-3 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-yellow-400 animate-bounce">
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                   </div>
                )}
              </div>

              <div className="w-full">
                <h2 className="text-3xl font-black text-secondary mb-2 tracking-tight uppercase leading-none">{user.name}</h2>
                <div className="flex items-center justify-center gap-2 mb-6">
                   {isVIP && <Badge variant="vip" className="px-3 py-1 text-[9px] font-black tracking-widest">PRO MEMBER</Badge>}
                   <Badge variant="default" className="bg-gray-100 text-gray-400 border-none px-3 py-1 text-[9px] font-black tracking-widest">ỨNG CỬ VIÊN</Badge>
                </div>
                
                <div className="space-y-4 mb-8 text-left bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                   <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="truncate">{user.email}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Hồ Chí Minh, Việt Nam</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <Button variant="primary" className="rounded-2xl py-4 font-black text-[10px] uppercase tracking-widest gap-2">
                    <Edit3 className="w-4 h-4" /> Sửa hồ sơ
                  </Button>
                  <Button variant="outline" className="rounded-2xl py-4 font-black text-[10px] uppercase tracking-widest gap-2 border-2 border-gray-200">
                    <Settings className="w-4 h-4" /> Cài đặt
                  </Button>
                </div>
              </div>
            </Card>

            {/* VIP Status Card */}
            <Card className={cn(
              "p-8 border-none transition-all duration-700 relative overflow-hidden group shadow-2xl",
              isVIP 
                ? "bg-secondary text-white shadow-secondary/20" 
                : "bg-white shadow-secondary/5 border-gray-100"
            )}>
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
               
               <div className="flex items-center justify-between mb-10 relative z-10">
                 <h3 className="text-xl font-black uppercase tracking-widest italic leading-none">Gói thành viên</h3>
                 {isVIP ? <Sparkles className="text-yellow-400 w-6 h-6 animate-pulse" /> : <Shield className="text-primary w-6 h-6" />}
               </div>

               {isVIP ? (
                 <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-5">
                       <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[9px]">Gói đăng ký</span>
                       <span className="text-yellow-400 font-black tracking-widest uppercase">{vipType === 'MONTHLY' ? 'Tháng' : 'Năm'} PRO</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-5">
                       <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[9px]">Ngày hết hạn</span>
                       <span className="font-black text-white">{vipExpireDate}</span>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-center">
                       <p className="text-[10px] text-gray-400 font-bold leading-relaxed italic uppercase tracking-widest">
                         Tận hưởng quyền lợi ưu tiên hiển thị & AI chuyên sâu
                       </p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-8 relative z-10">
                    <p className="text-sm text-gray-400 font-bold leading-relaxed uppercase tracking-widest text-center px-4">
                      Nâng cấp PRO để vượt mặt hàng nghìn ứng viên khác.
                    </p>
                    <Button 
                      variant="vip" 
                      className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl text-xs"
                      onClick={() => navigate("/subscription")}
                    >
                      Nâng cấp ngay
                    </Button>
                 </div>
               )}
            </Card>
          </div>

          {/* Activity & Layout */}
          <div className="lg:col-span-2 space-y-10">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {stats.map((stat, i) => (
                 <Card key={i} className="p-8 border-gray-50 shadow-xl shadow-secondary/5 flex flex-col items-center text-center group hover:border-primary transition-all duration-500 cursor-default relative overflow-hidden">
                    <div className={cn("p-4 rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110", stat.bg, stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-black text-secondary mb-1 leading-none">{stat.value}</div>
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 group-hover:text-primary transition-colors">{stat.label}</div>
                 </Card>
               ))}
            </div>

            {/* Badges */}
            <Card className="p-10 border-gray-50 shadow-xl shadow-secondary/5">
              <div className="flex items-center justify-between mb-12">
                <div>
                   <h3 className="text-2xl font-black text-secondary tracking-tight flex items-center gap-4 uppercase leading-none">
                     Thành tựu đạt được <Trophy className="text-yellow-500 w-7 h-7" />
                   </h3>
                   <div className="h-1 w-20 bg-primary mt-3 rounded-full"></div>
                </div>
                <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-70 transition-all border-b-2 border-primary/20 pb-1">Xem chi tiết</button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                 {currentBadges.map((badge, i) => (
                   <motion.div 
                     key={i}
                     whileHover={{ y: -10 }}
                     className="bg-gray-50/50 rounded-[2.5rem] p-6 flex flex-col items-center justify-center border-2 border-gray-100 relative group overflow-hidden transition-all hover:bg-white hover:shadow-2xl hover:shadow-secondary/10 hover:border-primary/20"
                   >
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center p-4 mb-4 relative z-10 transition-transform group-hover:scale-110">
                        <BadgeCheck className="w-full h-full text-primary" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-secondary text-center leading-tight relative z-10">{badge}</span>
                   </motion.div>
                 ))}
                 
                 <div className="bg-gray-50/20 rounded-[2.5rem] p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 group hover:border-primary/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors">
                       <Key className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-primary transition-colors">Tích điểm</span>
                 </div>
              </div>
            </Card>

            {/* AI Insights Card */}
            <Card className="p-10 border-none bg-gradient-to-br from-secondary to-gray-800 text-white shadow-2xl shadow-secondary/30 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
               <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] bg-white text-secondary flex flex-col items-center justify-center shadow-2xl flex-shrink-0 group-hover:rotate-3 transition-transform">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Đánh giá chung</span>
                     <span className="text-7xl font-black italic tracking-tighter">A<span className="text-primary">+</span></span>
                  </div>
                  <div className="flex-grow text-center md:text-left">
                     <h3 className="text-3xl font-black mb-4 tracking-tight uppercase">Phân tích ứng viên AI</h3>
                     <p className="text-gray-400 font-bold leading-relaxed mb-8 uppercase tracking-widest text-xs">
                        Hồ sơ của bạn cực kỳ tiềm năng trong lĩnh vực <span className="text-primary">Software Engineering</span>. 
                        Thuật toán gợi ý bạn đang nằm trong top 5% những ứng viên sáng giá nhất tuần này.
                     </p>
                     <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <Button variant="primary" className="rounded-2xl py-4 px-8 font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-primary/20">
                           Chi tiết phân tích
                        </Button>
                        <Button variant="outline" className="rounded-2xl py-4 px-8 font-black text-[10px] uppercase tracking-widest gap-2 border-white/20 text-white hover:bg-white hover:text-secondary">
                           <Share2 className="w-4 h-4" /> Chia sẻ Profile
                        </Button>
                     </div>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
