import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Briefcase,
  MousePointer2,
  UserCheck,
  TrendingUp,
  ChevronRight,
  PlusCircle,
  Calendar,
  Zap,
  Star,
  ShieldCheck,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "../../lib/utils";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { getEmployerJobs } from "../../services/recruiterService";

const data = [
  { name: "Mon", apps: 12 },
  { name: "Tue", apps: 25 },
  { name: "Wed", apps: 15 },
  { name: "Thu", apps: 32 },
  { name: "Fri", apps: 21 },
  { name: "Sat", apps: 8 },
  { name: "Sun", apps: 10 },
];

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Array<{ id: string; title: string; status?: string; deleted?: boolean }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getEmployerJobs();
        setJobs(res ?? []);
      } catch (e) {
        // Keep dashboard usable even if stats API fails.
        setJobs([]);
      }
    };
    load();
  }, []);

  const activeJobsCount = useMemo(
    () => jobs.filter((j) => !j.deleted && j.status === "PUBLISHED").length,
    [jobs]
  );

  const totalJobsCount = jobs.length;

  const cards = [
    {
      label: "Tin tuyển dụng chạy",
      value: String(activeJobsCount),
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: `Mục tiêu: 15`,
    },
    {
      label: "Tổng tin tuyển dụng",
      value: String(totalJobsCount),
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/5",
      trend: "+ số tin trong hệ thống",
    },
    {
      label: "Tỷ lệ tuyển dụng",
      value: "18.5%",
      icon: UserCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trend: "+2.1% tăng",
    },
    {
      label: "Lượt xem hồ sơ",
      value: "15.2k",
      icon: MousePointer2,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "Tương tác cao",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-secondary tracking-tighter mb-2 uppercase">Quản trị nhân tài</h1>
          <p className="text-gray-400 font-medium italic">Theo dõi phễu tuyển dụng và hiệu suất công việc theo thời gian thực.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl py-4 px-6 border-2 font-black text-xs uppercase tracking-widest gap-2">
            <Calendar className="w-4 h-4" />
            Lịch phỏng vấn
          </Button>
          <Button variant="primary" className="rounded-2xl py-4 px-6 shadow-xl shadow-primary/20 font-black text-xs uppercase tracking-widest gap-2">
            <PlusCircle className="w-4 h-4" />
            Đăng tin mới
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <Card className="p-8 shadow-xl shadow-secondary/5 border-gray-50 flex flex-col justify-between h-full relative overflow-hidden">
               <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700", card.bg)}></div>
               <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={cn("p-4 rounded-[1.25rem] shadow-lg transition-transform group-hover:rotate-6", card.bg)}>
                    <card.icon className={cn("w-7 h-7", card.color)} />
                  </div>
                  <Badge variant="default" className="bg-gray-50 text-gray-400 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                    {card.trend}
                  </Badge>
               </div>
               <div className="relative z-10">
                 <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{card.label}</p>
                 <h3 className="text-4xl font-black text-secondary group-hover:text-primary transition-colors">{card.value}</h3>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Chart Section */}
        <div className="xl:col-span-8">
          <Card className="p-10 shadow-2xl shadow-secondary/5 border-gray-50">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-primary/5 rounded-2xl">
                   <TrendingUp className="text-primary w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-secondary tracking-tight uppercase">Ý định ứng tuyển</h3>
                    <p className="text-xs font-bold text-gray-400">Xu hướng nộp hồ sơ 7 ngày qua</p>
                 </div>
              </div>
              <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1">
                <button className="px-4 py-2 bg-white text-primary font-black text-[10px] uppercase tracking-widest rounded-xl shadow-sm border border-gray-100">Hàng ngày</button>
                <button className="px-4 py-2 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-secondary rounded-xl transition-colors">Hàng tuần</button>
              </div>
            </div>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF3B3B" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#FF3B3B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
                  <XAxis 
                     dataKey="name" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 900}} 
                     dy={20}
                  />
                  <YAxis 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 900}} 
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '16px'}}
                    cursor={{stroke: '#FF3B3B', strokeWidth: 2, strokeDasharray: '6 6'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="apps" 
                    stroke="#FF3B3B" 
                    strokeWidth={5} 
                    fillOpacity={1} 
                    fill="url(#colorApps)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Latest jobs (real data) + AI Matches Section */}
        <div className="xl:col-span-4 space-y-8">
          <Card className="p-8 shadow-2xl shadow-secondary/5 border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-secondary uppercase tracking-widest">Tin tuyển dụng mới</h3>
                <p className="text-xs font-bold text-gray-400 mt-1">
                  {jobs.length ? "Tổng hợp từ tài khoản của bạn" : "Chưa có tin nào"}
                </p>
              </div>
              <Badge variant="default" className="bg-gray-50 text-gray-400 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                {jobs.length} jobs
              </Badge>
            </div>

            <div className="space-y-3">
              {(jobs ?? []).slice(0, 6).map((j) => (
                <div
                  key={j.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 hover:shadow-sm transition"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-black text-gray-900 truncate">{j.title}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {(j.status ?? "DRAFT").toString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
              ))}
              {!jobs.length && (
                <div className="text-gray-500 font-bold text-center py-6">
                  Hãy tạo tin tuyển dụng bằng Job Composer (AI).
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-secondary p-10 border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                  <Zap className="text-white w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-widest uppercase italic">AI Matchmaking</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Đề xuất bởi hệ thống</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { name: "Alice Nguyen", score: 98, role: "Senior Frontend", tag: "Chuyên gia" },
                  { name: "Tran Anh", score: 94, role: "UI/UX Designer", tag: "Sáng tạo" },
                  { name: "Le Hoang", score: 89, role: "Backend Developer", tag: "Ổn định" },
                ].map((cand, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group/cand">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="font-black text-white text-lg tracking-tight mb-1">{cand.name}</p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest">{cand.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-white flex items-center gap-1">
                          {cand.score}
                          <span className="text-[10px] text-gray-500">%</span>
                        </div>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Tương thích</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="default" className="bg-white/10 text-white border-none text-[9px] font-black uppercase tracking-widest px-3 py-1">
                        {cand.tag}
                      </Badge>
                      <button className="text-[10px] font-black text-white py-2 px-4 rounded-xl bg-primary hover:bg-primary/80 transition-all opacity-0 group-hover/cand:opacity-100 transform translate-y-2 group-hover/cand:translate-y-0 duration-300">
                        Hồ sơ
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="vip" className="w-full mt-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">
                Xem toàn bộ danh sách <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          <Card className="p-8 border-2 border-dashed border-gray-100 bg-transparent hover:border-primary transition-colors group cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-primary/5 transition-colors">
                <Target className="w-8 h-8 text-gray-300 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h4 className="text-secondary font-black text-sm uppercase tracking-widest mb-1">Mục tiêu quý</h4>
                <p className="text-xs text-gray-400 font-bold">12/15 Tin đã đăng</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
