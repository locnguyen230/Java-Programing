import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { paymentService, PaymentResponse } from "../../services/paymentService";
import { useAuthStore } from "../../store/useAuthStore";
import { 
  Loader2, 
  CheckCircle2, 
  Copy, 
  ChevronLeft, 
  Clock, 
  ShieldCheck, 
  Info,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import Button from "../../components/ui/Button";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { upgradeToVIP } = useAuthStore();
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [status, setStatus] = useState<"PENDING" | "SUCCESS" | "FAILED">("PENDING");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const planInfo = location.state?.planInfo;

  useEffect(() => {
    if (!planInfo) {
      navigate("/subscription");
      return;
    }

    const initPayment = async () => {
      try {
        const res = await paymentService.createPayment({
          amount: planInfo.price,
          paymentType: planInfo.id === "yearly" ? "VIP_YEARLY" : "VIP_MONTHLY"
        });
        setPaymentData(res);
      } catch (err) {
        toast.error("Không thể khởi tạo thanh toán. Vui lòng thử lại.");
        navigate("/subscription");
      } finally {
        setLoading(false);
      }
    };

    initPayment();

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [planInfo, navigate]);

  useEffect(() => {
    if (paymentData && status === "PENDING") {
      pollingRef.current = setInterval(async () => {
        try {
          const trans = await paymentService.getStatus(paymentData.transactionId);
          if (trans.status === "SUCCESS") {
            setStatus("SUCCESS");
            if (pollingRef.current) clearInterval(pollingRef.current);
            
            // For demo: upgrade local state
            const expireDate = planInfo.id === "yearly" 
                ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            
            upgradeToVIP(planInfo.name, expireDate);
            toast.success("Thanh toán thành công! Bạn hiện là hội viên VIP.");
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 5000);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (pollingRef.current) clearInterval(pollingRef.current);
            setStatus("FAILED");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        if (pollingRef.current) clearInterval(pollingRef.current);
      };
    }
  }, [paymentData, status, planInfo, upgradeToVIP]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const handleManualConfirm = async () => {
    if (!paymentData) return;
    try {
      toast.loading("Đang giả lập xác nhận từ ngân hàng...");
      await paymentService.simulateWebhook(paymentData.transactionId);
      // Polling will detect the change to SUCCESS
    } catch (err) {
      toast.error("Xác nhận thất bại");
    } finally {
      toast.dismiss();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || !paymentData) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
        <h2 className="text-2xl font-black text-secondary uppercase tracking-tight italic">Đang tạo mã QR thanh toán...</h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Đang kết nối an toàn với Napas VietQR</p>
      </div>
    );
  }

  if (status === "SUCCESS") {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border-2 border-emerald-100"
        >
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase italic mb-4">Thành công!</h2>
          <p className="text-gray-500 font-bold text-sm mb-10 leading-relaxed uppercase tracking-widest">
            Giao dịch chuyển khoản đã được xác nhận. <br />
            Chào mừng bạn đến với cộng đồng <span className="text-primary italic font-black">CareerMate VIP</span>.
          </p>
          <Button 
            className="w-full h-16 rounded-2xl bg-secondary text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-secondary/20"
            onClick={() => navigate("/")}
          >
            Bắt đầu trải nghiệm ngay
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate("/subscription")}
          className="flex items-center gap-2 text-gray-400 hover:text-primary font-black text-xs uppercase tracking-widest mb-12 transition-all group"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Quay lại chọn gói
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: QR Code */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-secondary/5 border border-gray-100 text-center relative overflow-hidden"
          >
            {/* Payment Header */}
            <div className="flex justify-between items-center mb-8 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left mb-1">Mã đơn hàng</p>
                  <p className="text-xs font-black text-secondary tracking-tighter uppercase text-left">#{paymentData.transactionId.slice(0, 8)}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Thời gian còn lại</p>
                  <div className="flex items-center gap-2 justify-end text-primary font-black">
                     <Clock className="w-4 h-4 animate-pulse" />
                     <span className={cn("text-lg tabular-nums tracking-tighter", timeLeft < 60 && "text-red-600")}>{formatTime(timeLeft)}</span>
                  </div>
               </div>
            </div>

            {/* QR Image Container */}
            <div className="relative group mx-auto w-72 h-72 mb-8">
               <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="relative bg-white p-6 rounded-[2.5rem] border-4 border-gray-50 shadow-inner overflow-hidden shadow-2xl">
                  <img 
                    src={paymentData.qrUrl} 
                    alt="VietQR Payment" 
                    className={cn("w-full h-full object-contain transition-opacity duration-500", status === "FAILED" && "opacity-20 grayscale")}
                  />
                  {status === "FAILED" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                       <p className="text-primary font-black text-xl uppercase tracking-tighter italic transform -rotate-12 border-4 border-primary px-4 py-2">Hết hạn</p>
                    </div>
                  )}
               </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                 <ShieldCheck className="w-5 h-5 text-emerald-500" />
                 <span className="text-[10px] font-black text-secondary uppercase tracking-[0.15em]">Giao dịch bảo mật qua Napas 247</span>
              </div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest px-10 leading-relaxed">
                Quét mã qua ứng dụng ngân hàng di động của bạn để thanh toán ngay lập tức.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Instructions & Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-secondary rounded-[3rem] p-10 text-white shadow-2xl shadow-secondary/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
               
               <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-8 border-b border-white/10 pb-4">Thông tin chuyển khoản</h3>
               
               <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-center group/row">
                     <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 leading-none">Chủ tài khoản</p>
                        <p className="text-xl font-black tracking-tighter uppercase italic">{paymentData.accountName}</p>
                     </div>
                     <button onClick={() => copyToClipboard(paymentData.accountName, "Tên tài khoản")} className="p-3 bg-white/5 rounded-xl hover:bg-white/20 transition-all opacity-0 group-hover/row:opacity-100"><Copy className="w-4 h-4" /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="group/row">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 leading-none">Số tài khoản</p>
                        <div className="flex items-center gap-3">
                           <p className="text-xl font-black tracking-tighter">{paymentData.accountNumber}</p>
                           <button onClick={() => copyToClipboard(paymentData.accountNumber, "Số tài khoản")} className="p-2 bg-white/5 rounded-xl hover:bg-white/20 transition-all opacity-0 group-hover/row:opacity-100"><Copy className="w-3.5 h-3.5" /></button>
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 leading-none">Ngân hàng</p>
                        <p className="text-xl font-black tracking-tighter uppercase italic">MB BANK (970422)</p>
                     </div>
                  </div>

                  <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 group-hover:bg-white/10 transition-all">
                     <div className="flex justify-between items-center mb-6">
                        <div>
                           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 leading-none">Số tiền cần trả</p>
                           <p className="text-4xl font-black text-primary tracking-tighter">${paymentData.amount}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 leading-none">Gói</p>
                           <p className="text-sm font-black uppercase tracking-widest italic">{planInfo.name}</p>
                        </div>
                     </div>
                     
                     <div className="bg-black/20 p-5 rounded-2xl border border-white/5 group/row">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 leading-none text-center">Nội dung chuyển khoản (Bắt buộc giữ nguyên)</p>
                        <div className="flex items-center justify-center gap-4">
                           <span className="text-lg font-black text-white tracking-[0.1em]">{paymentData.transactionId}</span>
                           <button onClick={() => copyToClipboard(paymentData.transactionId, "Nội dung")} className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><Copy className="w-4 h-4" /></button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 relative group">
               <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10">
                     <Info className="w-6 h-6" />
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest leading-none mt-1">Hướng dẫn thanh toán</h4>
                     <ol className="text-xs font-bold text-blue-800/70 space-y-3 list-decimal pl-4">
                        <li>Mở ứng dụng Ngân hàng trên điện thoại của bạn.</li>
                        <li>Chọn tính năng <strong className="text-blue-900 italic">Quét mã QR</strong>.</li>
                        <li>Quét mã QR bên trái và kiểm tra thông tin hiển thị.</li>
                        <li>Xác nhận số tiền và <strong className="text-blue-900 italic">Nội dung chuyển khoản</strong> chính xác.</li>
                        <li>Hoàn tất giao dịch và đợi hệ thống xử lý (từ 10-30s).</li>
                     </ol>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <Button 
                 onClick={handleManualConfirm}
                 className="flex-1 h-16 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-primary/20 active:scale-95 flex items-center justify-center gap-3"
               >
                 Tôi đã chuyển khoản <ArrowRight className="w-4 h-4" />
               </Button>
               <button 
                 onClick={() => setStatus("PENDING")}
                 className="px-8 h-16 rounded-2xl bg-white border-2 border-gray-100 text-secondary font-black text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all active:scale-95"
               >
                 Hỗ trợ
               </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
