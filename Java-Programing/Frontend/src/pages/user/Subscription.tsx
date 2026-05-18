import { useEffect, useState } from "react";
import { vipService, Plan } from "../../services/vipService";
import { useAuthStore } from "../../store/useAuthStore";
import { Check, Sparkles, Loader2, CreditCard, Shield, Zap, ChevronRight, Star, Globe, Lock, Rocket, Info } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function Subscription() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { isVIP, vipType, vipExpireDate, upgradeToVIP } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const data = await vipService.getPlans();
        console.log("Fetched plans:", data);
        if (data && Array.isArray(data)) {
          setPlans(data);
        } else {
          console.error("Invalid plans data format:", data);
          toast.error("Dữ liệu gói cước không hợp lệ");
        }
      } catch (err) {
        console.error("Fetch plans error:", err);
        toast.error("Không thể kết nối đến máy chủ để tải thông tin gói cước");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") return;
    
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    navigate("/payment", { state: { planInfo: plan } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Đang tải các gói đặc quyền...</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
           <Info className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-black text-secondary tracking-tighter uppercase italic mb-2">Hiện chưa có gói cước nào</h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-8">Vui lòng quay lại sau hoặc liên hệ hỗ trợ kỹ thuật.</p>
        <Button onClick={() => navigate("/")} variant="outline">Quay lại trang chủ</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-24 px-4 font-sans overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-yellow-700 mb-8 shadow-xl shadow-yellow-500/5"
          >
            <Sparkles className="w-4 h-4 fill-yellow-600" />
            Hội viên đặc quyền
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter mb-8 uppercase leading-none">
            Nâng tầm <span className="text-primary italic">Sự nghiệp</span> <br />
            Cùng CareerMate <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent italic">VIP</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-2xl font-bold max-w-3xl mx-auto uppercase tracking-widest leading-relaxed">
            Mở khóa sức mạnh AI, phân tích hồ sơ không giới hạn và ưu tiên tiếp cận các cơ hội hàng đầu thế giới.
          </p>
        </div>

        {isVIP && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto mb-20 bg-gradient-to-br from-secondary to-black rounded-[3rem] p-10 text-white shadow-2xl shadow-secondary/30 flex items-center gap-8 border-2 border-yellow-400/30 relative group overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
             <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-2xl shadow-yellow-500/40 relative z-10 group-hover:rotate-12 transition-transform">
                <Star className="w-10 h-10 text-white fill-white animate-pulse" />
             </div>
             <div className="relative z-10">
                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-1">Gói Hội Viên Đang Hoạt Động</h3>
                <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">
                  {vipType} • Có hiệu lực đến {new Date(vipExpireDate!).toLocaleDateString()}
                </p>
             </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch mb-32">
          {plans.map((plan) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "group flex flex-col bg-white rounded-[3.5rem] p-12 border-2 transition-all duration-500 relative",
                plan.recommended 
                  ? 'border-yellow-400 shadow-[0_40px_80px_-15px_rgba(234,179,8,0.2)] scale-105 z-10' 
                  : 'border-gray-50 shadow-2xl shadow-secondary/5 hover:border-primary/20 hover:shadow-primary/5'
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-yellow-500/40">
                  Phổ biến nhất
                </div>
              )}

              <div className="mb-12">
                <h3 className="text-3xl font-black text-secondary mb-4 uppercase tracking-tighter">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-secondary tracking-tighter italic">${plan.price}</span>
                  <span className="text-gray-300 font-black text-xs uppercase tracking-widest">/{plan.duration === "MONTHLY" ? "Tháng" : "Năm"}</span>
                </div>
              </div>

              <div className="space-y-6 mb-16 flex-grow">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 group/item">
                    <div className={cn(
                      "mt-1 shrink-0 w-6 h-6 rounded-xl flex items-center justify-center shadow-sm",
                      plan.recommended ? "bg-yellow-50 text-yellow-600" : "bg-primary/5 text-primary"
                    )}>
                      <Check className="w-3.5 h-3.5 stroke-[4]" />
                    </div>
                    <span className="text-sm font-bold text-gray-500 group-hover/item:text-secondary transition-colors leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={processingId !== null || (isVIP && plan.id !== "free")}
                className={cn(
                  "w-full h-20 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn disabled:opacity-50 active:scale-95",
                  plan.id === "free" 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : plan.recommended
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-2xl shadow-yellow-500/40'
                      : 'bg-secondary text-white shadow-2xl shadow-secondary/20 h-20 hover:bg-black'
                )}
              >
                {processingId === plan.id ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    <span className="relative z-10">{plan.id === "free" ? "Đang sử dụng" : isVIP ? "Đổi gói cước" : "Nâng cấp ngay"}</span>
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform relative z-10" />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-20 px-16 bg-white rounded-[4rem] shadow-2xl shadow-secondary/5 border-2 border-gray-50">
           {[
             { icon: Shield, color: "bg-emerald-50 text-emerald-600", title: "Thanh toán an toàn", desc: "Cổng thanh toán bảo mật SSL" },
             { icon: Zap, color: "bg-blue-50 text-blue-600", title: "Kích hoạt tức thì", desc: "Trạng thái VIP áp dụng ngay lập tức" },
             { icon: Rocket, color: "bg-purple-50 text-purple-600", title: "Hỗ trợ 24/7", desc: "Ưu tiên giải đáp mọi thắc mắc" },
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center text-center group">
                <div className={cn("w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 transform transition-transform group-hover:scale-110 group-hover:rotate-6", item.color)}>
                   <item.icon className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-secondary mb-2 uppercase tracking-tight">{item.title}</h4>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{item.desc}</p>
             </div>
           ))}
        </div>

        <div className="mt-32 text-center">
            <h5 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-4">Mọi giao dịch đều được đảm bảo bởi</h5>
            <div className="flex justify-center items-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               <Globe className="w-8 h-8" />
               <Lock className="w-8 h-8" />
               <CreditCard className="w-8 h-8" />
            </div>
        </div>
      </div>
    </div>
  );
}
