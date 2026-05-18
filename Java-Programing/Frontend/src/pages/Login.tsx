import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Briefcase, Mail, Lock, Eye, EyeOff, Loader2, ChevronRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import GoogleLoginButton from "../components/GoogleLoginButton";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.accessToken);
      
      toast.success("Chào mừng trở lại, " + response.user.name);
      
      const from = (location.state as any)?.from?.pathname || "/";
      if (response.user.role === "ADMIN") navigate("/admin");
      else if (response.user.role === "RECRUITER") navigate("/recruiter/dashboard");
      else navigate(from === "/login" ? "/" : from);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Thông tin đăng nhập không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const setTestAccount = (email: string) => {
    setValue("email", email);
    setValue("password", email === "admin@careermate.com" ? "AdminPassword123" : "123");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]"></div>
      </div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-secondary p-2 transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
      </Link>

      <div className="w-full max-w-[440px] relative z-10">
        <Card hoverable={false} className="p-10 shadow-2xl shadow-secondary/5 border-white">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6">
                <Briefcase className="text-white w-6 h-6" />
              </div>
            </Link>
            <h1 className="text-3xl font-black text-secondary tracking-tight mb-2 uppercase">Đăng nhập</h1>
            <p className="text-gray-400 font-medium text-sm">Cổng thông tin sự nghiệp CareerMate Professional</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input 
              label="Địa chỉ Email"
              placeholder="name@company.com"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="space-y-1.5">
               <div className="flex justify-between items-end mb-1 px-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Mật khẩu</label>
                  <Link to="/forgot-password" className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">Quên mật khẩu?</Link>
               </div>
               <div className="relative group">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                 <input 
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-14 py-3 bg-white border ${errors.password ? 'border-primary ring-4 ring-primary/5' : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/5'} rounded-xl outline-none transition-all font-bold text-secondary placeholder:font-medium`}
                 />
                 <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors"
                 >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
               </div>
               {errors.password && <p className="text-[10px] font-bold text-primary ml-1">{errors.password.message}</p>}
            </div>

            <label className="flex items-center gap-3 cursor-pointer group px-1">
              <input type="checkbox" {...register("rememberMe")} className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary transition-all" />
              <span className="text-xs text-gray-400 font-bold group-hover:text-secondary uppercase tracking-widest">Duy trì đăng nhập</span>
            </label>

            <Button 
              type="submit" 
              className="w-full py-4 text-sm font-black tracking-[0.2em] uppercase rounded-[1.25rem]"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Xác nhận truy cập"}
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-50 text-center">
            <p className="text-sm font-bold text-gray-400 mb-6">Hoặc tiếp tục với</p>
            
            {/* Google Login Button */}
            <div className="mb-6">
              <GoogleLoginButton />
            </div>

            <div className="flex gap-4">
               <button className="flex-grow flex items-center justify-center gap-3 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-secondary text-sm">
                 <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/></svg>
                 GitHub
               </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
               <button onClick={() => setTestAccount("vuxhide@gmail.com")} className="px-3 py-1.5 bg-red-50 text-[10px] font-black text-primary uppercase tracking-widest rounded-lg border border-primary/10 hover:bg-red-100 transition-all">Quick Candidate</button>
               <button onClick={() => setTestAccount("recruiter@example.com")} className="px-3 py-1.5 bg-blue-50 text-[10px] font-black text-blue-600 uppercase tracking-widest rounded-lg border border-blue-100 hover:bg-blue-100 transition-all">Quick Recruiter</button>
               <button onClick={() => setTestAccount("admin@careermate.com")} className="px-3 py-1.5 bg-secondary text-[10px] font-black text-white uppercase tracking-widest rounded-lg border border-secondary hover:bg-secondary/90 transition-all">Quick Admin</button>
            </div>
          </div>
        </Card>

        <p className="mt-8 text-center text-sm font-bold text-gray-400">
          Chưa có tài khoản? <Link to="/register" className="text-primary hover:underline">Khám phá ngay</Link>
        </p>
      </div>
    </div>
  );
}
