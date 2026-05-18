import React, { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, ChevronRight, TrendingUp, Users, Building, Laptop, DollarSign, Clock, Star, Heart, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { getJobs } from "../../services/jobService";
import { cn } from "../../lib/utils";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";

export default function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const categories = [
    { name: "Kinh doanh / Bán hàng", icon: Users, count: 150 },
    { name: "IT Phần mềm", icon: Laptop, count: 120 },
    { name: "Marketing", icon: TrendingUp, count: 85 },
    { name: "Hành chính", icon: Building, count: 64 },
    { name: "Tài chính", icon: DollarSign, count: 42 },
    { name: "Kỹ thuật", icon: Briefcase, count: 77 },
    { name: "Thiết kế", icon: Star, count: 38 },
  ];

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className="pb-24">
      {/* SaaS Hero Section */}
      <section className="bg-secondary pt-20 pb-32 text-center relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Sự nghiệp bứt phá <br />
              <span className="text-primary italic">chỉ sau một cú chạm.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
              Kết nối hơn 60.000+ doanh nghiệp hàng đầu cùng hệ thống tư vấn AI chuyên sâu độc quyền tại Vietnam.
            </p>
          </motion.div>

          {/* SaaS Search Experience */}
          <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="bg-white rounded-[2rem] p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-grow flex items-center px-4 gap-4">
                <Search className="text-primary w-6 h-6 flex-shrink-0" />
                <input 
                  type="text" 
                  placeholder="Vị trí, kỹ năng hoặc tên công ty..."
                  className="w-full py-4 text-secondary font-semibold outline-none placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="h-10 w-px bg-gray-100 hidden md:block self-center"></div>
              <div className="flex-shrink-0 flex items-center px-4 gap-3 bg-gray-50 rounded-2xl mx-1 md:bg-transparent">
                <MapPin className="text-gray-400 w-5 h-5" />
                <select className="bg-transparent py-4 text-secondary font-bold outline-none appearance-none cursor-pointer pr-4">
                  <option>Tất cả tỉnh thành</option>
                  <option>Hà Nội</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Đà Nẵng</option>
                </select>
              </div>
              <Button size="lg" className="px-12 rounded-2xl">Tìm kiếm</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-6 hidden lg:block sticky top-28">
            <Card hoverable={false} className="p-4 bg-white/70 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6 px-2">
                <TrendingUp className="text-primary w-5 h-5" />
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Lĩnh vực HOT</h3>
              </div>
              <div className="space-y-1">
                {categories.map((cat, i) => (
                  <button 
                    key={i}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 hover:text-primary group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 transition-colors">
                        <cat.icon className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                      </div>
                      <span className="text-secondary font-bold group-hover:text-primary text-sm">{cat.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-secondary to-black p-6 border-none overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full translate-x-12 -translate-y-12 blur-2xl"></div>
              <div className="relative z-10">
                <Badge variant="vip" className="mb-4">Limited Offer</Badge>
                <h4 className="text-white font-black text-xl mb-2">PRO Dashboard</h4>
                <p className="text-gray-400 text-xs mb-6 font-medium">Báo cáo thị trường lương & Phân tích cơ hội độc quyền.</p>
                <button 
                  onClick={() => navigate("/subscription")}
                  className="w-full py-3 bg-white text-secondary font-black rounded-xl text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Nâng cấp
                </button>
              </div>
            </Card>
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-9 space-y-10">
            {/* Top Trending Jobs */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2 items-center">
                   <div className="w-2 h-8 bg-primary rounded-full"></div>
                   <h2 className="text-2xl font-black text-secondary tracking-tight">Việc làm mới nhất</h2>
                </div>
                <Link to="/" className="text-sm font-black text-primary uppercase tracking-[0.2em] border-b-2 border-primary/20 pb-1 hover:border-primary transition-all">Xem tất cả</Link>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    [1,2,3,4,5].map(i => (
                        <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-gray-100 shadow-sm"></div>
                    ))
                ) : (
                  jobs.map((job) => (
                    <Link key={job.id} to={`/jobs/${job.id}`}>
                      <Card className={cn(
                        "p-6 flex flex-col md:flex-row gap-8 items-start md:items-center relative transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-secondary/10",
                        job.id === "1" ? "border-yellow-200 ring-2 ring-yellow-400/5 bg-gradient-to-br from-white to-yellow-50/10" : "border-gray-50 bg-white"
                      )}>
                        {/* Company Logo Section */}
                        <div className="w-24 h-24 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] flex-shrink-0 flex items-center justify-center p-5 relative group-hover:rotate-6 transition-transform">
                          <Building className="text-gray-300 w-10 h-10" />
                          {job.id === "1" && (
                             <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                                <Sparkles className="w-5 h-5 text-white fill-white" />
                             </div>
                          )}
                        </div>

                        {/* Content Area */}
                        <div className="flex-grow min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-black text-secondary truncate group-hover:text-primary transition-colors uppercase leading-none">
                                  {job.title}
                                </h3>
                                {job.id === "1" && <Badge variant="vip" className="px-2 py-0.5 text-[8px] font-black tracking-widest">VIP</Badge>}
                              </div>
                              <p className="text-gray-400 font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                                <span className="hover:text-primary cursor-pointer transition-colors">{job.company}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>{job.location}</span>
                              </p>
                            </div>
                            <div className="md:text-right flex-shrink-0">
                              <p className="text-primary font-black text-2xl leading-none mb-2 tracking-tighter">{job.salary}</p>
                              <div className="flex flex-wrap gap-2 md:justify-end">
                                 <Badge variant="default" className="text-[9px] font-black text-gray-400 bg-gray-50 border-none px-3">FULL-TIME</Badge>
                                 <Badge variant="default" className="text-[9px] font-black text-gray-400 bg-gray-50 border-none px-3">2+ YEARS</Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-50">
                            <div className="flex items-center gap-2 text-gray-300 group-hover:text-gray-400 transition-colors">
                               <Clock className="w-4 h-4" />
                               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cập nhật 2h trước</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 group-hover:text-gray-400 transition-colors">
                               <Briefcase className="w-4 h-4" />
                               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Software Development</span>
                            </div>
                            <div className="hidden sm:flex flex-grow"></div>
                            <div className="flex items-center gap-3">
                               <div className="flex -space-x-3">
                                 {[1,2,3].map(i => (
                                   <div key={i} className="w-8 h-8 rounded-xl border-2 border-white bg-gray-100 shadow-sm relative overflow-hidden">
                                      <img src={`https://i.pravatar.cc/150?u=${i + job.id}`} alt="User" className="w-full h-full object-cover" />
                                   </div>
                                 ))}
                                 <div className="w-8 h-8 rounded-xl border-2 border-white bg-gray-900 flex items-center justify-center text-[8px] font-black text-white shadow-sm">+15</div>
                               </div>
                               <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest hidden lg:block">đã ứng tuyển</span>
                            </div>
                          </div>
                        </div>

                        {/* Favorite Button */}
                        <button 
                          onClick={(e) => toggleFavorite(e, job.id)}
                          className={cn(
                            "absolute top-6 right-6 md:static p-4 rounded-2xl border-2 transition-all active:scale-90",
                            favorites.includes(job.id) ? "border-primary bg-primary text-white shadow-xl shadow-primary/30" : "border-gray-50 text-gray-300 hover:text-primary hover:border-primary/20 hover:bg-primary/5"
                          )}
                        >
                          <Heart className={cn("w-6 h-6 transition-colors", favorites.includes(job.id) && "fill-white")} />
                        </button>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Newsletter SaaS Card */}
            <Card className="bg-primary p-8 border-none flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-primary/30 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
               <div className="flex-grow text-center md:text-left relative z-10">
                 <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Đừng bỏ lỡ công việc phù hợp?</h2>
                 <p className="text-white/80 font-medium italic">Chúng tôi sẽ gửi các cơ hội tốt nhất trực tiếp qua Email của bạn mỗi ngày.</p>
               </div>
               <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto relative z-10">
                 <input 
                  type="email" 
                  placeholder="your-email@gmail.com" 
                  className="bg-white/20 border border-white/20 text-white placeholder:text-white/60 py-3 px-6 rounded-xl outline-none focus:bg-white focus:text-secondary transition-all font-bold min-w-[250px]"
                 />
                 <button className="bg-white text-primary px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all active:scale-95 shadow-xl">Đăng ký ngay</button>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
