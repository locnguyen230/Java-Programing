import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { 
  BarChart2, 
  Briefcase, 
  Users, 
  PlusCircle, 
  LogOut, 
  Bell,
  MessageSquare,
  HelpCircle,
  Menu,
  X,
  CreditCard
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

export default function RecruiterLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { icon: BarChart2, label: "Bảng điều khiển", path: "/recruiter" },
    { icon: PlusCircle, label: "Đăng tin tuyển dụng", path: "/recruiter/post-job" },
    { icon: Briefcase, label: "Việc làm đã đăng", path: "/recruiter/jobs-manage" },
    { icon: Users, label: "Quản lý ứng viên", path: "/recruiter/candidates" },
    { icon: CreditCard, label: "Gói cước & Thanh toán", path: "/recruiter/billing" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-gray-100 transition-all duration-500 flex flex-col shrink-0 overflow-hidden relative z-20 shadow-2xl shadow-secondary/5",
          isSidebarOpen ? "w-80" : "w-24"
        )}
      >
        <div className="p-8 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0 shadow-2xl shadow-primary/20 transform group-hover:rotate-6 transition-transform">
              <Briefcase className="text-white w-7 h-7" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col -space-y-1">
                <span className="text-2xl font-black text-secondary tracking-tighter italic">Hire<span className="text-primary italic">Mate</span></span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-300">Recruiter Portal</span>
              </div>
            )}
          </Link>
        </div>

        <nav className="mt-10 flex-grow px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-[1.5rem] transition-all group relative overflow-hidden",
                  isActive 
                    ? "bg-primary text-white shadow-2xl shadow-primary/30" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-primary"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all",
                  isActive ? "bg-white/20" : "bg-gray-50 group-hover:bg-primary/10"
                )}>
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "group-hover:text-primary")} />
                </div>
                {isSidebarOpen && <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-50">
          {isSidebarOpen && (
             <div className="mb-8 p-6 bg-gray-900 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group/card">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full blur-2xl group-hover/card:scale-150 transition-transform duration-1000"></div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 relative z-10">Gói Diamond Active</p>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-3 relative z-10">
                   <div className="bg-primary h-full w-[80%] shadow-[0_0_10px_#FF3B3B]"></div>
                </div>
                <p className="text-[10px] text-gray-400 font-bold relative z-10 italic">Còn 16/20 tin tuyển dụng</p>
             </div>
          )}
          <button 
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl text-gray-400 hover:bg-primary/5 hover:text-primary transition-all w-full group",
              !isSidebarOpen && "justify-center"
            )}
          >
            <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-primary/10 transition-all">
               <LogOut className="w-5 h-5 shrink-0" />
            </div>
            {isSidebarOpen && <span className="font-black text-xs uppercase tracking-widest">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden relative">
        <header className="bg-white/80 backdrop-blur-xl h-24 border-b border-gray-100 flex items-center justify-between px-10 shrink-0 sticky top-0 z-10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition-all active:scale-95 border border-transparent hover:border-gray-100 shadow-sm"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="h-8 w-px bg-gray-100 hidden md:block"></div>
            <h2 className="text-xl font-black text-secondary uppercase tracking-tight italic hidden md:block">
               {menuItems.find(m => m.path === location.pathname)?.label || "Trung tâm tuyển dụng"}
            </h2>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-4 bg-[#F9FAFB] px-5 py-2.5 rounded-2xl border border-gray-100 shadow-inner">
               <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-400"></div>
               <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Cổng tuyển dụng: Trực tuyến</span>
            </div>
            <button className="p-3 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white shadow-sm"></span>
            </button>
            <div className="h-10 w-px bg-gray-100"></div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block font-sans">
                <p className="text-sm font-black text-secondary leading-none mb-1 group-hover:text-primary transition-colors">{user?.name}</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest leading-none italic">Hiring Lead</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center font-black text-lg border-2 border-primary/20 shadow-2xl shadow-secondary/10 group-hover:scale-105 transition-all overflow-hidden p-0.5">
                <img src={`https://i.pravatar.cc/150?u=${user?.id || 'recruiter'}`} alt="Recruiter" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-10 lg:p-14 bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
