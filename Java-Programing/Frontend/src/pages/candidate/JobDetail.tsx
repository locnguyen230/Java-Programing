import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DollarSign, MapPin, Briefcase, ChevronRight, Loader2, AlertCircle, Bookmark, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { getJobById } from "../../services/jobService";
import { cn } from "../../lib/utils";

// Components
import CompanyHeader from "../../components/job-detail/CompanyHeader";
import JobSidebar from "../../components/job-detail/JobSidebar";
import JobGallery from "../../components/job-detail/JobGallery";
import ApplyButton from "../../components/job-detail/ApplyButton";
import ApplyApplicationModal from "../../components/job-detail/ApplyApplicationModal";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!id) return;
        const data = await getJobById(id);
        setJob(data);
      } catch (err) {
        setError("Failed to fetch job details. It might not exist anymore.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const [applyOpen, setApplyOpen] = useState(false);

  const applied = !!job?.applied;

  const openApply = () => {
    if (applied) return;
    setApplyOpen(true);
  };

  const closeApply = () => setApplyOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Accessing Job Dossier...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-xl text-center border-2 border-dashed border-gray-200">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Job Not Found</h2>
          <p className="text-gray-500 font-medium mb-8">This opportunity may have expired or been removed from our database.</p>
          <button 
            onClick={() => navigate("/")}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const isVIP = job.isPremium;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <CompanyHeader 
          company={job.company} 
          logoColor={job.logoColor}
          isVIP={isVIP}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-white p-10 rounded-[2.5rem] shadow-xl shadow-secondary/5 border-2 transition-all",
                isVIP ? "border-yellow-200 ring-4 ring-yellow-400/5" : "border-gray-50"
              )}
            >
              {isVIP && (
                <div className="flex items-center gap-2 mb-8">
                   <div className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2 shadow-lg shadow-yellow-500/30">
                      <Sparkles className="w-4 h-4 fill-white" /> Ưu tiên hiển thị
                   </div>
                </div>
              )}

              <h2 className="text-3xl md:text-5xl font-black text-secondary mb-10 leading-tight tracking-tight uppercase">
                {job.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  { icon: DollarSign, label: "Mức lương", value: job.salary, color: "text-primary", bg: "bg-primary/5" },
                  { icon: MapPin, label: "Địa điểm", value: job.location, color: "text-secondary", bg: "bg-secondary/5" },
                  { icon: Briefcase, label: "Kinh nghiệm", value: "0 - 3 năm", color: "text-indigo-600", bg: "bg-indigo-50" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-3 group">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-3 rounded-2xl transition-all group-hover:rotate-12", item.bg)}>
                        <item.icon className={cn("w-5 h-5", item.color)} />
                      </div>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{item.label}</p>
                    </div>
                    <p className="text-xl font-black text-secondary ml-1 transition-colors group-hover:text-primary">{item.value}</p>
                  </div>
                ))}
              </div>

              <ApplyButton onApply={openApply} isVIP={isVIP} />

              {job?.id && (
                <ApplyApplicationModal
                  open={applyOpen}
                  onClose={closeApply}
                  jobId={job?.id}
                  jobTitle={job?.title}
                  companyName={job?.company?.name}
                />
              )}

              <div className="space-y-12 pt-10 border-t border-gray-50">
                {/* Requirements */}
                <div>
                  <h3 className="text-2xl font-black text-secondary mb-8 tracking-tight flex items-center gap-3 uppercase">
                    Chi tiết công việc
                    <Bookmark className="w-6 h-6 text-gray-200" />
                  </h3>
                  
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">Mô tả</h4>
                      <p className="text-gray-500 font-medium leading-[1.8] text-lg">
                        Chúng tôi đang tìm kiếm ứng viên tiềm năng cho vị trí <span className="text-secondary font-black">{job.title}</span>. 
                        Bạn sẽ có cơ hội làm việc trong môi trường chuyên nghiệp, năng động và sáng tạo.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">Yêu cầu</h4>
                      <ul className="space-y-5">
                        {job.requirements?.map((req: string, i: number) => (
                          <li key={i} className="flex gap-5 group items-start">
                            <div className="mt-1 w-6 h-6 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-all">
                               <CheckCircle2 className="w-3.5 h-3.5 text-gray-300 group-hover:text-white" />
                            </div>
                            <span className="text-gray-600 font-bold leading-relaxed">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button className="mt-10 text-primary font-black text-xs uppercase tracking-[0.2em] hover:underline flex items-center gap-2 group border-2 border-primary/10 px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all">
                    Tải bản mô tả PDF
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">Lĩnh vực & Kỹ năng</h4>
                  <div className="flex flex-wrap gap-3">
                    {job.categories?.map((cat: string, i: number) => (
                      <span key={i} className="bg-white text-secondary px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-gray-50 shadow-sm hover:border-primary hover:text-primary cursor-pointer transition-all">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <JobGallery images={job.images || []} />
          </div>

          {/* Sidebar */}
          <JobSidebar 
            level={job.level}
            education={job.education}
            quantity={job.quantity}
            type={job.type}
            deadline={job.deadline}
            isVIP={isVIP}
          />
        </div>
      </div>
    </div>
  );
}
