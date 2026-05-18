import { useEffect } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Star,
  Loader2 
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import Badge from "../../components/ui/Badge";

export default function AdminDashboard() {
  const { stats, loading, fetchStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    { label: "Tổng người dùng", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%" },
    { label: "Thành viên VIP", value: Math.floor(stats.totalUsers * 0.15), icon: Star, color: "text-yellow-600", bg: "bg-yellow-50", trend: "+24%" },
    { label: "Việc làm đang chờ", value: stats.totalJobs, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+4%" },
    { label: "Doanh thu tổng", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50", trend: "+28%" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-secondary tracking-tighter uppercase italic mb-2">Trung tâm quản trị</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Tổng hợp dữ liệu hệ thống thời gian thực.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white border-2 border-gray-100 text-secondary rounded-2xl font-black text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all shadow-sm">Xuất báo cáo</button>
          <button className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-primary/20">Cấu hình hệ thống</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] shadow-xl shadow-secondary/5 border border-gray-50 group hover:border-primary transition-all duration-500 cursor-default"
          >
            <div className="flex justify-between items-start mb-8">
              <div className={cn("p-4 rounded-[1.25rem] transition-all duration-500 group-hover:rotate-12", card.bg)}>
                <card.icon className={cn("w-6 h-6", card.color)} />
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-100">
                <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                {card.trend}
              </div>
            </div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 leading-none">{card.label}</p>
            <h3 className="text-4xl font-black text-secondary tracking-tighter">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Revenue Chart */}
        <div className="lg:col-span-7 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-secondary/5 border border-gray-50">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-secondary uppercase tracking-tight italic">Biểu đồ doanh thu</h3>
            <div className="flex gap-2">
                 <button className="bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-transparent hover:border-gray-200 transition-all">6 Tháng</button>
                 <button className="bg-primary/5 px-4 py-2 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest border border-primary/10">1 Năm</button>
            </div>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B3B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FF3B3B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                    dy={15} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '20px'}}
                  itemStyle={{fontWeight: 900, textTransform: 'uppercase', fontSize: '12px'}}
                />
                <Area type="monotone" dataKey="amount" stroke="#FF3B3B" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="lg:col-span-5 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-secondary/5 border border-gray-50">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-secondary uppercase tracking-tight italic">Tăng trưởng</h3>
            <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#FF3B3B]"></span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đã đăng ký</span>
            </div>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <Tooltip 
                   cursor={{fill: '#F9FAFB'}}
                   contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '20px'}}
                />
                <Bar dataKey="users" fill="#111827" radius={[12, 12, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-secondary/5 border border-gray-50 overflow-hidden mb-10">
        <div className="p-10 border-b border-gray-50 flex justify-between items-center">
           <h3 className="text-2xl font-black text-secondary tracking-tight uppercase italic leading-none">Hoạt động hệ thống</h3>
           <button className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline border-2 border-primary/10 px-5 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all">Xem toàn bộ nhật ký</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Thực thể</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Hành động</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Thời điểm</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-secondary font-black text-xs group-hover:bg-primary group-hover:text-white transition-all">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-sm font-black text-secondary uppercase tracking-tight">TechCorp Vietnam #{i+102}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-sm text-gray-500 font-bold tracking-tight">Duyệt tin tuyển dụng mới: Marketing Lead</td>
                  <td className="px-10 py-6 text-[10px] text-gray-400 font-black uppercase tracking-widest">{i + 1} phút trước</td>
                  <td className="px-10 py-6">
                    <Badge variant="default" className="bg-emerald-50 text-emerald-600 text-[9px] font-black tracking-widest">SUCCESS</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
