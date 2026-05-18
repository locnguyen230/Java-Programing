import React, { useState, useRef, useEffect } from "react";
import { getCareerAdvice } from "../../services/aiService";
import { MessageSquare, Send, Bot, User, Loader2, Sparkles, Trash2, ShieldCheck, Zap, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function CareerAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là Cố vấn Sự nghiệp AI của bạn. Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể hỏi về định hướng nghề nghiệp, kỹ năng phỏng vấn, hoặc cách tối ưu CV.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await getCareerAdvice(input);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: res.message,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Rất tiếc, tôi đang gặp khó khăn khi kết nối. Vui lòng thử lại sau.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-20 px-4 flex flex-col items-center font-sans">
      <div className="max-w-4xl w-full flex flex-col h-[800px] bg-white rounded-[3rem] shadow-2xl shadow-secondary/5 border-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary/20"></div>
        
        {/* Chat Header */}
        <div className="bg-white p-8 flex justify-between items-center shrink-0 border-b border-gray-50 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-secondary rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-secondary/20 relative group overflow-hidden">
               <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
               <Bot className="w-8 h-8 text-white relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-secondary tracking-tight uppercase leading-none">Cố vấn CareerMate</h2>
                <Badge variant="vip" className="px-2 py-0.5 text-[8px] font-black tracking-widest">ADVANCED AI</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-400"></div>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Sẵn sàng hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-4 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
            title="Xóa cuộc hội thoại"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-10 space-y-8 scroll-smooth bg-gray-50/30"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex items-end gap-5",
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border",
                  msg.sender === "user" ? "bg-white text-primary border-primary/20" : "bg-secondary text-white border-secondary"
                )}>
                  {msg.sender === "user" ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5 fill-white" />}
                </div>
                <div className={cn(
                  "max-w-[75%] p-6 rounded-[2rem] text-sm font-bold leading-relaxed shadow-2xl shadow-secondary/5",
                  msg.sender === "user" 
                    ? "bg-primary text-white rounded-br-none border-2 border-primary" 
                    : "bg-white border-2 border-gray-100 text-secondary rounded-bl-none"
                )}>
                  {msg.text}
                  <div className={cn(
                    "text-[10px] mt-4 font-black uppercase tracking-widest opacity-50",
                    msg.sender === "user" ? "text-right" : "text-left"
                  )}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex items-center gap-5"
            >
              <div className="w-10 h-10 rounded-2xl bg-secondary text-white flex items-center justify-center border-2 border-secondary overflow-hidden group">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-white border-2 border-gray-100 p-6 rounded-[2rem] rounded-bl-none shadow-2xl shadow-secondary/5">
                <div className="flex gap-2">
                  <span className="w-2 h-2 bg-primary/20 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-10 bg-white border-t border-gray-50 shrink-0 shadow-2xl relative z-10">
          <form onSubmit={handleSend} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
               <Zap className="w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text"
              placeholder="Hỏi bất cứ điều gì về sự nghiệp của bạn..."
              className="w-full pl-16 pr-24 py-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all font-bold text-secondary text-sm placeholder:text-gray-300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-3 top-3 bottom-3 bg-primary text-white px-8 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-secondary transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center active:scale-95 group/btn"
            >
              <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
               {[
                 "Cách phỏng vấn Software Engineer?",
                 "Xu hướng việc làm IT 2025?",
                 "Cách đàm phán lương hiệu quả?",
               ].map((hint, i) => (
                 <button 
                  key={i}
                  onClick={() => setInput(hint)} 
                  className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-primary hover:bg-primary/5 transition-all bg-gray-50/50 px-5 py-2.5 rounded-full border-2 border-gray-100"
                 >
                   {hint}
                 </button>
               ))}
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-6">
             <ShieldCheck className="w-3.5 h-3.5 text-gray-300" />
             <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">Bảo mật và riêng tư chuyên biệt bởi CareerMate AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
