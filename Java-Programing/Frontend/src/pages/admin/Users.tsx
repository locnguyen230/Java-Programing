import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { Search, UserX, UserCheck, Shield, ChevronLeft, ChevronRight, Loader2, MoreVertical, Filter } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export default function Users() {
  const { users, fetchUsers } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchUsers();
      setLoading(false);
    };
    load();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h1 className="text-4xl font-black text-secondary tracking-tighter uppercase italic mb-2">Danh sách tài khoản</h1>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Quản lý người dùng, phân quyền và trạng thái bảo mật.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-xl shadow-secondary/5 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-secondary text-sm placeholder:font-medium placeholder:text-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-4 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:text-primary hover:border-primary transition-all shadow-xl shadow-secondary/5">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-secondary/5 border border-gray-50 overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Danh tính</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Phân quyền</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Trạng thái</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Đang đồng bộ dữ liệu hệ thống...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <p className="text-gray-300 font-black uppercase text-xs italic">Không tìm thấy tài khoản phù hợp với từ khóa.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform">
                          <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-secondary leading-tight uppercase tracking-tight mb-0.5">{user.name}</p>
                          <p className="text-xs text-gray-400 font-bold italic">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                        user.role === "RECRUITER" ? "bg-amber-50 text-amber-600 border-amber-100" : 
                        user.role === "CANDIDATE" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-primary/5 text-primary border-primary/10"
                      )}>
                        <Shield className="w-3.5 h-3.5" />
                        {user.role}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest",
                        user.status === "ACTIVE" ? "text-emerald-600 bg-emerald-50 border border-emerald-100" : "text-primary bg-primary/5 border border-primary/10"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", user.status === "ACTIVE" ? "bg-emerald-500 animate-pulse shadow-[0_0_5px_#10B981]" : "bg-primary shadow-[0_0_5px_#FF3B3B]")}></span>
                        {user.status}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        {user.status === "ACTIVE" ? (
                          <button className="p-3 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all active:scale-90" title="Khóa tài khoản">
                            <UserX className="w-5 h-5" />
                          </button>
                        ) : (
                          <button className="p-3 text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all active:scale-90" title="Mở khóa tài khoản">
                            <UserCheck className="w-5 h-5" />
                          </button>
                        )}
                        <button className="p-3 text-gray-300 hover:text-secondary hover:bg-gray-100 rounded-2xl transition-all active:scale-90">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
              Hiển thị {filteredUsers.length} tài khoản trong tổng số {users.length}
           </p>
           <div className="flex gap-2">
             <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all disabled:opacity-30" disabled><ChevronLeft className="w-5 h-5" /></button>
             <button className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl font-black text-xs shadow-lg shadow-primary/20">1</button>
             <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-400 font-black text-xs hover:border-primary hover:text-primary transition-all">2</button>
             <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all"><ChevronRight className="w-5 h-5" /></button>
           </div>
        </div>
      </div>
    </div>
  );
}
