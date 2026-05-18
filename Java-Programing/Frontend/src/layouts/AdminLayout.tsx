import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  DollarSign, 
  BarChart3, 
  LogOut, 
  Settings, 
  Bell,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: "Tổng quan", path: "/admin" },
    { icon: Users, label: "Quản trị người dùng", path: "/admin/users" },
    { icon: Briefcase, label: "Kiểm duyệt việc làm", path: "/admin/jobs" },
    { icon: DollarSign, label: "Tài chính & Doanh thu", path: "/admin/finance" },
    { icon: BarChart3, label: "Phân tích hệ thống", path: "/admin/analytics" },
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
          "bg-secondary text-white transition-all duration-500 flex flex-col shrink-0 overflow-hidden relative z-20 shadow-2xl",
          isSidebarOpen ? "w-80" : "w-24"
        )}
      >
        <div className="p-8 flex items-center justify-between">
          {isSidebarOpen ? (
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transform group-hover:rotate-6 transition-transform">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-black tracking-tighter italic">Admin<span className="text-primary italic">Core</span></span>
                <span className="text-[8px] uppercase tracking-[0.3em] font-black text-gray-500 leading-none">CareerMate Professional</span>
              </div>
            </Link>
          ) : (
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg mx-auto transform hover:rotate-6 transition-transform">
                <ShieldCheck className="text-white w-6 h-6" />
             </div>
          )}
        </div>

        <nav className="mt-10 flex-grow px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-[1.25rem] transition-all group relative overflow-hidden",
                  isActive 
                    ? "bg-primary text-white shadow-2xl shadow-primary/20" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all",
                  isActive ? "bg-white/20" : "bg-transparent group-hover:bg-white/10"
                )}>
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "group-hover:text-primary")} />
                </div>
                {isSidebarOpen && <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>}
                {isActive && isSidebarOpen && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-lg"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <button 
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl text-gray-500 hover:bg-primary hover:text-white transition-all w-full group",
              !isSidebarOpen && "justify-center"
            )}
          >
            <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/20 transition-all">
               <LogOut className="w-5 h-5 shrink-0" />
            </div>
            {isSidebarOpen && <span className="font-black text-xs uppercase tracking-widest">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden relative">
        <header className="bg-white h-24 border-b border-gray-100 flex items-center justify-between px-10 shrink-0 sticky top-0 z-10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition-all active:scale-95 border border-transparent hover:border-gray-100 shadow-sm"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="h-8 w-px bg-gray-100 hidden md:block"></div>
            <h2 className="text-xl font-black text-secondary uppercase tracking-tight italic hidden md:block">
               {menuItems.find(m => m.path === location.pathname)?.label || "Bảng điều khiển"}
            </h2>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-3 bg-[#F9FAFB] px-5 py-2.5 rounded-[1.25rem] border border-gray-100 shadow-inner">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-400"></div>
               <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Hệ thống bảo mật: Hoạt động</span>
            </div>
            <button className="p-3 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm"></span>
            </button>
            <div className="h-10 w-px bg-gray-100"></div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-secondary leading-none mb-1 group-hover:text-primary transition-colors">{user?.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none italic">Root Administrator</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center font-black text-lg border-2 border-primary/20 shadow-2xl shadow-secondary/10 group-hover:scale-105 transition-transform overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${user?.id || 'admin'}`} alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-10 lg:p-12 bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
