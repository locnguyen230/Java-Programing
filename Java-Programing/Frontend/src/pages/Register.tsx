import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Mail, Lock, User, Eye, EyeOff, Loader2, Building, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import GoogleLoginButton from "../components/GoogleLoginButton";

const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string()
    .min(8, "Mật khẩu ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Cần ít nhất 1 chữ hoa")
    .regex(/[0-9]/, "Cần ít nhất 1 chữ số"),
  confirmPassword: z.string(),
  role: z.enum(["CANDIDATE", "RECRUITER"]),
  companyName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === "RECRUITER" && !data.companyName) return false;
  return true;
}, {
  message: "Tên công ty là bắt buộc đối với Nhà tuyển dụng",
  path: ["companyName"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CANDIDATE",
    }
  });

  const selectedRole = watch("role");
  const password = watch("password") || "";

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      setAuth(response.user, response.accessToken);
      toast.success("Tạo tài khoản thành công!");
      navigate(response.user.role === "RECRUITER" ? "/recruiter/dashboard" : "/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const passwordCriteria = [
    { label: "Ít nhất 8 ký tự", met: password.length >= 8 },
    { label: "Có chữ hoa", met: /[A-Z]/.test(password) },
    { label: "Có chữ số", met: /[0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]"></div>
      </div>

      <Link to="/login" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-secondary p-2 transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
      </Link>

      <div className="w-full max-w-[540px] relative z-10">
        <Card hoverable={false} className="p-10 shadow-2xl shadow-secondary/5 border-white">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6">
                <Briefcase className="text-white w-6 h-6" />
              </div>
            </Link>
            <h1 className="text-3xl font-black text-secondary tracking-tight mb-2 uppercase">Gia nhập ngay</h1>
            <p className="text-gray-400 font-medium text-sm">Cơ hội tiếp cận 60.000+ doanh nghiệp hàng đầu.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection SaaS Style */}
            <div className="bg-gray-50 p-1.5 rounded-2xl flex gap-1.5 border border-gray-100">
               <label className="flex-grow cursor-pointer relative group">
                  <input type="radio" value="CANDIDATE" className="hidden peer" {...register("role")} />
                  <div className="py-2.5 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-xl transition-all peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm">
                     Ứng viên
                  </div>
               </label>
               <label className="flex-grow cursor-pointer relative group">
                  <input type="radio" value="RECRUITER" className="hidden peer" {...register("role")} />
                  <div className="py-2.5 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-xl transition-all peer-checked:bg-secondary peer-checked:text-white peer-checked:shadow-sm">
                     Nhà tuyển dụng
                  </div>
               </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Input 
                 label="Họ tên"
                 placeholder="Nguyễn Văn A"
                 icon={<User className="w-4 h-4" />}
                 error={errors.fullName?.message}
                 {...register("fullName")}
               />
               <Input 
                 label="Địa chỉ Email"
                 placeholder="name@gmail.com"
                 icon={<Mail className="w-4 h-4" />}
                 error={errors.email?.message}
                 {...register("email")}
               />
            </div>

            <AnimatePresence mode="wait">
              {selectedRole === "RECRUITER" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Input 
                    label="Tên doanh nghiệp"
                    placeholder="Công ty TNHH VNG..."
                    icon={<Building className="w-4 h-4" />}
                    error={errors.companyName?.message}
                    {...register("companyName")}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-4 h-4" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 bg-white border ${errors.password ? 'border-primary' : 'border-gray-200 focus:border-primary'} rounded-xl outline-none transition-all font-bold text-sm`}
                  />
                  <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary"
                 >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                 </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Xác nhận</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 bg-white border ${errors.confirmPassword ? 'border-primary' : 'border-gray-200 focus:border-primary'} rounded-xl outline-none transition-all font-bold text-sm`}
                  />
                </div>
              </div>
            </div>

            {/* Password Policy */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
               {passwordCriteria.map((c, i) => (
                 <div key={i} className="flex items-center gap-2">
                   <div className={`w-3 h-3 rounded-full flex items-center justify-center ${c.met ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                      {c.met && <Check className="w-2 h-2 stroke-[4]" />}
                   </div>
                   <span className={`text-[9px] font-black uppercase tracking-tight ${c.met ? 'text-primary' : 'text-gray-400'}`}>
                      {c.label}
                   </span>
                 </div>
               ))}
            </div>

            <div className="flex items-start gap-3 py-1 px-1">
               <input type="checkbox" required className="w-5 h-5 mt-0.5 rounded-lg border-2 border-gray-100 text-primary focus:ring-primary transition-all cursor-pointer" />
               <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">
                 Tôi đồng ý với <a href="#" className="text-primary hover:underline">Điều khoản</a> & <a href="#" className="text-primary hover:underline">Bảo mật</a> của CareerMate.
               </p>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 text-sm font-black tracking-[0.2em] uppercase rounded-[1.25rem]"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Ghi danh tài khoản"}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50">
            <p className="text-sm font-bold text-gray-400 mb-4">Hoặc tiếp tục với</p>
            <div className="mb-6">
              <GoogleLoginButton />
            </div>

            <div className="text-center">
              <p className="text-sm font-bold text-gray-400">
                Bạn đã là thành viên? <Link to="/login" className="text-primary hover:underline">Đăng nhập ngay</Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
