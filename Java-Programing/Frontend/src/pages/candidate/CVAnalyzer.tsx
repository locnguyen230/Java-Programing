import { useState } from "react";
import { analyzeCV } from "../../services/aiService";
import { FileText, Upload, CheckCircle2, Sparkles, AlertCircle, Loader2, BarChart3, Target, Zap, ChevronLeft, Bookmark, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import VIPGuard from "../../components/VIPGuard";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function CVAnalyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await analyzeCV(text);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-20 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-primary/5 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/10 shadow-sm"
          >
            <Sparkles className="w-4 h-4 fill-primary animate-pulse" />
            AI-POWERED INSIGHTS
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-secondary mb-6 tracking-tighter uppercase leading-none">
            Phân tích CV <span className="text-primary italic">thông minh</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-bold max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
            Nhận phản hồi tức thì từ AI. Tối ưu hóa kỹ năng và bứt phá sự nghiệp ngay hôm nay.
          </p>
        </div>

        {!result ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-10 shadow-2xl shadow-secondary/5 border-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-primary/30 transform transition-transform group-hover:rotate-6">
                    <FileText className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-secondary tracking-tight uppercase leading-none mb-2">Dán nội dung hồ sơ</h2>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sao chép văn bản từ tệp CV của bạn vào ô dưới đây</p>
                  </div>
                </div>

                <textarea 
                  className="w-full h-96 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] p-8 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all font-bold text-secondary leading-[1.8] overflow-y-auto placeholder:text-gray-200 placeholder:italic"
                  placeholder="Ví dụ: Nguyễn Văn A - Kỹ sư phần mềm... Kinh nghiệm làm việc tại... Kỹ năng: React, TypeScript, Java..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-gray-50">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] max-w-sm text-center md:text-left leading-relaxed">
                    Bằng cách phân tích, bạn đồng ý để AI của chúng tôi xử lý dữ liệu. Thông tin cá nhân của bạn được bảo mật tuyệt đối.
                  </p>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={loading || !text.trim()}
                    className="w-full md:w-auto h-20 px-12 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/30 flex items-center gap-4 disabled:opacity-50 group active:scale-95"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 fill-white" />}
                    Bắt đầu phân tích AI
                  </Button>
                </div>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-6 flex items-center gap-3 text-primary bg-primary/5 p-4 rounded-xl border border-primary/10"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-xs font-black uppercase tracking-widest leading-none">{error}</span>
                  </motion.div>
                )}
              </div>
            </Card>

            <div className="mt-12 flex flex-wrap gap-8 justify-center">
              {[
                { icon: CheckCircle2, label: "Tương thích ATS" },
                { icon: ShieldCheck, label: "Bảo mật dữ liệu" },
                { icon: Target, label: "Tối ưu từ khóa" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-300" />
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <VIPGuard>
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              {/* Header Result */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-10 shadow-2xl shadow-secondary/5 border-gray-50 md:col-span-2 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 fill-primary" /> Tóm tắt chuyên môn
                  </h3>
                  <p className="text-xl font-bold text-secondary leading-relaxed tracking-tight group-hover:text-primary transition-colors">{result.summary}</p>
                </Card>
                <Card className="bg-secondary p-10 border-none shadow-2xl shadow-secondary/20 relative overflow-hidden flex flex-col justify-center items-center text-white group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 relative z-10">AI CV SCORE</div>
                  <div className="text-8xl font-black mb-2 relative z-10 italic tracking-tighter">
                    {result.score}<span className="text-primary text-4xl">.</span>
                  </div>
                  <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] relative z-10">TỔNG ĐIỂM CHUẨN</div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skills Analysis */}
                <Card className="p-10 shadow-2xl shadow-secondary/5 border-gray-50 group hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                      <Zap className="text-blue-600 w-7 h-7 fill-blue-600" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-secondary tracking-tight uppercase leading-none mb-1">Kỹ năng đặc trưng</h3>
                       <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Định danh năng lực AI</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {result.skills.map((skill: string, i: number) => (
                      <Badge key={i} className="bg-blue-50 text-blue-700 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-blue-100 hover:bg-blue-600 hover:text-white transition-all cursor-default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>

                {/* Strengths */}
                <Card className="p-10 shadow-2xl shadow-secondary/5 border-gray-50 group hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-primary/5 rounded-2xl group-hover:scale-110 transition-transform">
                      <Target className="text-primary w-7 h-7 fill-primary" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-secondary tracking-tight uppercase leading-none mb-1">Điểm mạnh cốt lõi</h3>
                       <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Giá trị cạnh tranh</p>
                    </div>
                  </div>
                  <ul className="space-y-5">
                    {result.strengths.map((strength: string, i: number) => (
                      <li key={i} className="flex gap-4 group/item">
                        <div className="mt-1 w-6 h-6 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover/item:bg-primary group-hover/item:border-primary transition-all">
                           <CheckCircle2 className="w-3.5 h-3.5 text-gray-300 group-hover/item:text-white" />
                        </div>
                        <span className="text-secondary font-bold text-sm leading-relaxed group-hover/item:text-primary transition-colors">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Improvement Suggestions */}
                <Card className="p-10 shadow-2xl shadow-secondary/5 border-gray-50 md:col-span-2 group hover:border-amber-200 transition-colors">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="p-4 bg-amber-50 rounded-2xl group-hover:scale-110 transition-transform">
                      <BarChart3 className="text-amber-600 w-7 h-7" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-secondary tracking-tight uppercase leading-none mb-1">Đề xuất tối ưu hóa</h3>
                       <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Chiến lược bứt phá CV</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {result.improvements.map((improvement: string, i: number) => (
                      <div key={i} className="flex gap-6 p-8 rounded-[2rem] bg-gray-50 border-2 border-gray-100/50 hover:bg-white hover:shadow-2xl hover:shadow-secondary/5 hover:border-amber-100 transition-all group/opt">
                        <div className="w-12 h-12 rounded-[1.5rem] bg-white shadow-xl text-amber-600 flex items-center justify-center font-black text-lg flex-shrink-0 group-hover/opt:rotate-6 transition-transform">
                          {i + 1}
                        </div>
                        <p className="text-sm text-secondary font-bold leading-relaxed">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="flex justify-center pt-12">
                <Button 
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="rounded-2xl py-4 px-10 border-2 font-black uppercase tracking-[0.2em] text-xs gap-3 hover:bg-secondary hover:text-white hover:border-secondary transition-all active:scale-95 shadow-xl"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Phân tích CV khác
                </Button>
              </div>
            </motion.div>
          </VIPGuard>
        )}
      </div>
    </div>
  );
}
