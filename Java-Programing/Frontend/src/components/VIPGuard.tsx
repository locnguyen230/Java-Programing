import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Sparkles, X, Check, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VIPGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function VIPGuard({ children, fallback }: VIPGuardProps) {
  const { isVIP } = useAuthStore();

  if (isVIP) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative group">
      <div className="filter blur-[4px] pointer-events-none select-none opacity-50 grayscale">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-3xl border-2 border-dashed border-yellow-200">
        <div className="text-center p-8 bg-white rounded-[2rem] shadow-2xl max-w-sm border border-yellow-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-yellow-500/20">
            <Sparkles className="text-white w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Premium Area</h3>
          <p className="text-gray-500 text-sm font-medium mb-6">
            This high-tier analysis feature is reserved for our VIP members.
          </p>
          <Link 
            to="/subscription"
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-yellow-600/20"
          >
            Upgrade to VIP
          </Link>
        </div>
      </div>
    </div>
  );
}

export const UpgradeModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-yellow-100"
          >
            <div className="h-32 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center relative">
               <Sparkles className="text-white w-16 h-16 opacity-30 absolute right-8 top-4 rotate-12" />
               <h2 className="text-3xl font-black text-white italic tracking-tighter">VIP MEMBERSHIP</h2>
            </div>
            
            <button 
               onClick={onClose}
               className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-all"
            >
               <X className="w-5 h-5" />
            </button>

            <div className="p-10">
               <div className="space-y-4 mb-8">
                  {[
                    "Unlimited AI CV Analysis",
                    "Priority Recruitment Matching",
                    "VIP Gold Badge Profile",
                    "Ad-Free Premium Experience",
                    "Direct Support Channel"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center p-1">
                          <Check className="text-yellow-600 w-4 h-4" />
                       </div>
                       <span className="text-gray-700 font-bold">{feat}</span>
                    </div>
                  ))}
               </div>

               <div className="flex flex-col gap-3">
                  <Link 
                    to="/subscription"
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-5 rounded-2xl font-black text-center uppercase tracking-widest shadow-xl shadow-yellow-500/30 hover:shadow-2xl hover:scale-[1.02] transition-all"
                  >
                    View Plans
                  </Link>
                  <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     Starting at $19.99/mo
                  </p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
