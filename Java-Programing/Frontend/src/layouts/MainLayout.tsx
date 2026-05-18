import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, User, Search, Briefcase, Bell, Sparkles, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import Button from "../components/ui/Button";
import { useState, useEffect } from "react";

export default function MainLayout() {
  const { user, logout, isVIP } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo and Main Nav */}
            <div className="flex items-center gap-12">
              <Link to="/" className="flex items-center gap-3 group">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 shadow-2xl",
                  isVIP ? "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-500/20" : "bg-primary shadow-primary/20"
                )}>
                  {isVIP ? <Sparkles className="text-white w-7 h-7 animate-pulse" /> : <Briefcase className="text-white w-7 h-7" />}
                </div>
                <div className="flex flex-col -space-y-1.5">
                  <span className="text-3xl font-black tracking-tighter text-secondary italic">
                    Career<span className="text-primary italic">Mate</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300">Professional Hub</span>
                </div>
              </Link>
              
              <nav className="hidden lg:flex gap-10 items-center">
                <Link to="/" className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-primary transition-all">Việc làm</Link>
                <Link to="/learning-hub" className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-primary transition-all">Học tập</Link>
                <Link to="/cv-analyzer" className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-primary transition-all">AI Lab</Link>
                <Link to="/career-advisor" className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-primary transition-all font-primary">Coach AI</Link>
                <Link to="/job-search-direction" className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-primary transition-all">
                  Roadmap tìm việc
                </Link>
                <div className="h-6 w-px bg-gray-100"></div>
                <Link to="/subscription" className={cn(
                  "text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 rounded-xl transition-all shadow-xl",
                  isVIP ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-yellow-500/20" : "text-primary bg-primary/5 hover:bg-primary hover:text-white border border-primary/10 shadow-primary/5"
                )}>
                  {isVIP ? "PRO ACCESS" : "Nâng cấp VIP"}
                </Link>
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <div className="flex lg:hidden">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>

              {user ? (
                <>
                  <div className="hidden md:flex items-center gap-4">
                    <Link
                      to="/notifications"
                      className="p-2.5 text-gray-400 hover:text-primary hover:bg-red-50 rounded-xl transition-all relative"
                      aria-label="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                    </Link>
                    <button className="p-2.5 text-gray-400 hover:text-secondary hover:bg-gray-50 rounded-xl transition-all">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="h-8 w-px bg-gray-100 hidden md:block"></div>

                  <div className="flex items-center gap-4 group cursor-pointer relative py-2">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-secondary leading-tight">{user.name}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {isVIP ? "Premium Member" : "Standard User"}
                      </p>
                    </div>
                    <Link to="/profile" className={cn(
                      "w-10 h-10 rounded-xl border-2 flex items-center justify-center p-0.5 transition-all group-hover:scale-105 group-hover:shadow-lg",
                      isVIP ? "border-yellow-400" : "border-gray-100"
                    )}>
                      <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                        <User className="w-6 h-6" />
                      </div>
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="ml-2 p-2.5 text-gray-300 hover:text-primary hover:bg-red-50 rounded-xl transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-secondary px-4">Đăng nhập</Link>
                  <Link to="/register">
                    <Button size="sm">Đăng ký</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-6 px-4 space-y-4 shadow-xl">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-black text-gray-500 uppercase tracking-widest px-4 py-3 hover:bg-gray-50 rounded-xl"
            >
              Việc làm
            </Link>
            <Link 
              to="/learning-hub" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-black text-gray-500 uppercase tracking-widest px-4 py-3 hover:bg-gray-50 rounded-xl"
            >
              Học tập
            </Link>
            <Link 
              to="/cv-analyzer" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-black text-gray-500 uppercase tracking-widest px-4 py-3 hover:bg-gray-50 rounded-xl"
            >
              AI Lab
            </Link>
            <Link 
              to="/career-advisor" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-black text-gray-500 uppercase tracking-widest px-4 py-3 hover:bg-gray-50 rounded-xl"
            >
              Coach AI
            </Link>
            <Link 
              to="/job-search-direction" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-black text-gray-500 uppercase tracking-widest px-4 py-3 hover:bg-gray-50 rounded-xl"
            >
              Roadmap tìm việc
            </Link>
            <div className="h-px bg-gray-100 mx-4"></div>
            <Link 
              to="/subscription" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block text-center text-[10px] font-black uppercase tracking-[0.3em] px-5 py-4 rounded-xl transition-all shadow-xl mx-4",
                isVIP ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-yellow-500/20" : "text-primary bg-primary/5 border border-primary/10 shadow-primary/5"
              )}
            >
              {isVIP ? "PRO ACCESS" : "Nâng cấp VIP"}
            </Link>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Modern SaaS Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                   <Briefcase className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-black text-secondary">CareerMate</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm font-medium">
                Nền tảng tuyển dụng thông minh dựa trên AI, giúp kết nối nhân tài chuyên môn cao với những doanh nghiệp hàng đầu.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl"></div>
                <div className="w-10 h-10 bg-gray-50 rounded-xl"></div>
                <div className="w-10 h-10 bg-gray-50 rounded-xl"></div>
              </div>
            </div>
            
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="text-sm font-black text-secondary uppercase tracking-widest mb-6">Ứng viên</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                  <li className="hover:text-primary transition-colors cursor-pointer">Tìm kiếm việc làm</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Viết CV với AI</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Lộ trình học tập</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-black text-secondary uppercase tracking-widest mb-6">Hệ sinh thái</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                  <li className="hover:text-primary transition-colors cursor-pointer">Cộng đồng UTH</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Blog sự nghiệp</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Hỗ trợ 24/7</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-black text-secondary uppercase tracking-widest mb-6">Pháp lý</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                  <li className="hover:text-primary transition-colors cursor-pointer">Điều khoản</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Bảo mật</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              © 2024 CareerMate Professional. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
               <span>Vietnam</span>
               <span>English (US)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
