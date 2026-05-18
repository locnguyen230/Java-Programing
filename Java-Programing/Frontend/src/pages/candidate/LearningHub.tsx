import React, { useState } from "react";
import { BookOpen, Map, Zap, CheckCircle2, ChevronRight, Play, Star, Clock, Trophy, Users, Sparkles, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const ROADMAPS = [
  {
    id: "java",
    title: "Java Fullstack Developer",
    desc: "Lộ trình từ cơ bản đến chuyên gia cho sinh viên UTH.",
    steps: [
      { id: 1, title: "Java Fundamentals", status: "COMPLETED" },
      { id: 2, title: "Spring Boot Pro", status: "IN_PROGRESS" },
      { id: 3, title: "Microservices Architecture", status: "LOCKED" },
    ],
    progress: 45,
    color: "bg-red-500"
  },
  {
    id: "frontend",
    title: "React & Modern Web",
    desc: "Thành thạo React, Next.js và Tailwind CSS.",
    steps: [
      { id: 1, title: "HTML/CSS Mastery", status: "COMPLETED" },
      { id: 2, title: "JavaScript ES6+", status: "COMPLETED" },
      { id: 3, title: "React Ecosystem", status: "IN_PROGRESS" },
    ],
    progress: 75,
    color: "bg-blue-500"
  }
];

const COURSES = [
  { id: 1, title: "Java Core cho người mới", instructor: "Nguyễn Văn Chiến", students: 1200, rating: 4.8, price: "Miễn phí", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400" },
  { id: 2, title: "Cấu trúc dữ liệu & Giải thuật", instructor: "Trần Thế Anh", students: 850, rating: 4.9, price: "Miễn phí", image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=400" },
  { id: 3, title: "Spring Boot & AWS Cloud", instructor: "CareerMate AI Agent", students: 3400, rating: 5.0, price: "VIP", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400" },
];

export default function LearningHub() {
  const [activeTab, setActiveTab] = useState<"roadmaps" | "courses">("roadmaps");

  return (
    <div className="pb-24 bg-[#F9FAFB] min-h-screen font-sans">
      {/* SaaS Hero Section */}
      <section className="bg-secondary pt-32 pb-48 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-5 py-2 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles className="w-4 h-4 fill-primary animate-pulse" /> Trung tâm học thuật AI
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-none">
              Trang bị kỹ năng <br/><span className="text-primary italic">Thống trị thị trường</span>
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg md:text-xl font-bold uppercase tracking-widest leading-relaxed">
              Phân tích kỹ năng từ dữ liệu thực tế giúp đề xuất lộ trình học tập tối ưu, được thiết kế riêng cho sự nghiệp của bạn.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl shadow-secondary/5 flex gap-2 border border-white">
            <button 
              onClick={() => setActiveTab("roadmaps")}
              className={cn(
                "px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all gap-3 flex items-center shadow-sm",
                activeTab === "roadmaps" ? "bg-secondary text-white shadow-xl shadow-secondary/20" : "text-gray-400 hover:text-primary hover:bg-primary/5"
              )}
            >
              <Map className="w-4 h-4" /> Lộ trình AI
            </button>
            <button 
              onClick={() => setActiveTab("courses")}
              className={cn(
                "px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all gap-3 flex items-center shadow-sm",
                activeTab === "courses" ? "bg-secondary text-white shadow-xl shadow-secondary/20" : "text-gray-400 hover:text-primary hover:bg-primary/5"
              )}
            >
              <GraduationCap className="w-4 h-4" /> Khóa học PRO
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "roadmaps" ? (
            <motion.div 
              key="roadmaps"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10"
            >
              {ROADMAPS.map((roadmap) => (
                <Card key={roadmap.id} className="p-10 hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-700 group border-gray-50 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h3 className="text-3xl font-black text-secondary mb-3 uppercase tracking-tighter italic group-hover:text-primary transition-colors leading-none">{roadmap.title}</h3>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{roadmap.desc}</p>
                    </div>
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl transform transition-transform group-hover:rotate-6", roadmap.color)}>
                      <Zap className="w-8 h-8 fill-white" />
                    </div>
                  </div>

                  <div className="mb-10 relative z-10">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Tiến trình hiện tại</span>
                        <span className="text-sm font-black text-secondary italic tracking-tighter leading-none">{roadmap.progress}%</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1 border border-gray-100 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${roadmap.progress}%` }}
                        className={cn("h-full rounded-full shadow-sm", roadmap.color)}
                      />
                    </div>
                  </div>

                  <div className="space-y-6 mb-12 relative z-10">
                    {roadmap.steps.map((step) => (
                      <div key={step.id} className="flex items-center gap-5 group/step">
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm",
                          step.status === "COMPLETED" ? "bg-green-50 border-green-500 text-green-600 shadow-green-100" : 
                          step.status === "IN_PROGRESS" ? "bg-white border-primary text-primary animate-pulse shadow-primary/20" :
                          "bg-white border-gray-100 text-gray-200"
                        )}>
                          {step.status === "COMPLETED" ? <CheckCircle2 className="w-5 h-5 stroke-[3]" /> : <Play className="w-4 h-4 fill-current" />}
                        </div>
                        <span className={cn(
                            "font-black text-sm uppercase tracking-widest transition-colors",
                            step.status === "LOCKED" ? "text-gray-300 italic" : "text-secondary"
                        )}>{step.title}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="mt-auto h-20 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary/30 group-hover:shadow-primary/40 relative z-10">
                    Tiếp tục học ngay <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="courses"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              {COURSES.map((course) => (
                <Card key={course.id} className="p-0 overflow-hidden group hover:border-primary/20 transition-all duration-700 flex flex-col relative border-gray-50">
                  <div className="h-64 overflow-hidden relative">
                    <img src={course.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-120 group-hover:rotate-2" alt={course.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-[1.25rem] flex items-center gap-2 shadow-2xl">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-black tracking-tighter">{course.rating}</span>
                    </div>
                    {course.price === "VIP" && (
                      <div className="absolute top-6 left-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-2xl shadow-yellow-500/40">
                        ⭐ Special VIP
                      </div>
                    )}
                  </div>
                  <div className="p-10 flex-grow flex flex-col relative z-10">
                    <h3 className="text-2xl font-black text-secondary mb-4 uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors italic">{course.title}</h3>
                    <div className="flex items-center gap-2 mb-8">
                       <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shadow-sm">
                          <img src={`https://i.pravatar.cc/150?u=${course.instructor}`} className="w-full h-full object-cover" />
                       </div>
                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">{course.instructor}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto pt-8 border-t border-gray-50/50">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                          <Users className="w-4 h-4" /> {course.students}
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                          <Clock className="w-4 h-4" /> 12H
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs font-black italic uppercase tracking-[0.2em]",
                        course.price === "Miễn phí" ? "text-green-500" : "text-yellow-500"
                      )}>{course.price}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gamification Section */}
      <div className="max-w-7xl mx-auto px-4 mt-32">
        <div className="bg-secondary rounded-[4rem] p-16 text-white relative overflow-hidden shadow-[0_40px_80px_-15px_rgba(31,41,55,0.3)] border-2 border-primary/10 group">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-primary/40 transform -rotate-12 group-hover:rotate-0 transition-transform">
                  <Trophy className="w-9 h-9 text-white drop-shadow-xl" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Thách thức <br /> <span className="text-primary italic">UTH Excellence</span></h2>
              </div>
              <p className="text-gray-400 text-lg md:text-xl font-bold leading-relaxed mb-10 uppercase tracking-widest italic">
                Hoàn thành các thử thách lập trình hàng tuần để nhận Huy hiệu (Badges) và tăng cơ hội lọt vào tầm ngắm của các doanh nghiệp Top đầu toàn cầu.
              </p>
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                <div className="bg-white/5 backdrop-blur-2xl px-8 py-6 rounded-[2rem] border border-white/10 text-center shadow-2xl shadow-black/20">
                  <div className="text-4xl font-black mb-2 tracking-tighter italic text-primary">1,248</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Huy hiệu đã cấp</div>
                </div>
                <div className="bg-white/5 backdrop-blur-2xl px-8 py-6 rounded-[2rem] border border-white/10 text-center shadow-2xl shadow-black/20">
                  <div className="text-4xl font-black mb-2 tracking-tighter italic text-primary">#04</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Thứ hạng của bạn</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 relative">
               {[
                 { label: "Java Master", color: "bg-red-500" },
                 { label: "AI Pioneer", color: "bg-blue-500" },
                 { label: "Top Contributor", color: "bg-emerald-500" },
                 { label: "Elite Solver", color: "bg-amber-500" },
               ].map((badge, i) => (
                 <div key={i} className="w-36 h-36 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex flex-col items-center justify-center gap-3 group cursor-pointer transition-all hover:bg-white/10 hover:scale-110 hover:rotate-6 shadow-2xl">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl", badge.color)}>
                       <Star className="w-8 h-8 fill-white" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-center px-4 leading-tight text-gray-400 group-hover:text-white transition-colors">{badge.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
