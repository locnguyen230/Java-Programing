import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";
import { authService } from "../services/authService";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success("Đã gửi liên kết khôi phục tới email của bạn!");
    } catch (err) {
      toast.error("Quá trình thất bại. Vui lòng kiểm tra lại email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Decorative Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 relative z-10"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-10 hover:underline group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Quay lại đăng nhập
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-black text-secondary tracking-tighter uppercase italic leading-none mb-4">Khôi phục</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Nhập email của bạn để nhận liên kết khôi phục mật khẩu.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 leading-none">Email đã đăng ký</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email"
                  required
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-secondary placeholder:font-medium placeholder:text-gray-300"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  Gửi yêu cầu <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="bg-primary/5 p-10 rounded-[2rem] border-2 border-primary/10 text-center">
             <div className="w-20 h-20 bg-white text-primary rounded-[1.5rem] shadow-xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                <Mail className="w-10 h-10" />
             </div>
             <h3 className="text-xl font-black text-secondary uppercase tracking-tighter italic mb-3">Kiểm tra hộp thư</h3>
             <p className="text-gray-500 font-bold text-sm leading-relaxed mb-8">
               Chúng tôi đã gửi hướng dẫn khôi phục tới <strong className="text-primary">{email}</strong>. Vui lòng kiểm tra kỹ hòm thư của bạn.
             </p>
             <button 
                onClick={() => setSubmitted(false)}
                className="text-primary font-black hover:underline text-[10px] uppercase tracking-widest"
             >
                Gửi lại yêu cầu mới
             </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
