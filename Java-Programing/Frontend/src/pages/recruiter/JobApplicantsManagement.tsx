import React, { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  acceptApplication,
  getEmployerJobs,
  getJobApplicants,
  rejectApplication,
} from "../../services/recruiterService";

type LoadState = "idle" | "loading" | "success" | "error";

type EmployerJob = {
  id: string;
  title: string;
  status?: string;
};

type EmployerApplicant = {
  id?: string;
  applicationId?: string;
  status?: string;
  appliedAt?: string;
  user?: {
    fullName?: string;
    email?: string;
  };
  candidate?: {
    fullName?: string;
    email?: string;
  };
};

export default function JobApplicantsManagement() {
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [applicants, setApplicants] = useState<EmployerApplicant[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) ?? null,
    [jobs, selectedJobId]
  );

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoadState("loading");
        const res = await getEmployerJobs();
        const data = Array.isArray(res) ? res : [];
        setJobs(data);

        if (data.length > 0) setSelectedJobId(data[0].id);
        setLoadState("success");
      } catch {
        setLoadState("error");
        toast.error("Không tải được danh sách tin tuyển dụng");
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    const loadApplicants = async () => {
      if (!selectedJobId) return;

      try {
        setLoadState("loading");
        const res = await getJobApplicants(selectedJobId);
        const data = Array.isArray(res) ? res : [];
        setApplicants(data as EmployerApplicant[]);
        setLoadState("success");
      } catch {
        setLoadState("error");
        toast.error("Không tải được danh sách ứng viên");
      }
    };

    loadApplicants();
  }, [selectedJobId]);

  const refreshApplicants = async () => {
    if (!selectedJobId) return;
    const res = await getJobApplicants(selectedJobId);
    const data = Array.isArray(res) ? res : [];
    setApplicants(data as EmployerApplicant[]);
  };

  const onAccept = async (applicationId: string) => {
    try {
      setActionBusyId(applicationId);
      await acceptApplication(applicationId);
      toast.success("Đã ACCEPT ứng viên");
      await refreshApplicants();
    } catch {
      toast.error("Không thể ACCEPT ứng viên");
    } finally {
      setActionBusyId(null);
    }
  };

  const onReject = async (applicationId: string) => {
    try {
      setActionBusyId(applicationId);
      await rejectApplication(applicationId);
      toast.success("Đã REJECT ứng viên");
      await refreshApplicants();
    } catch {
      toast.error("Không thể REJECT ứng viên");
    } finally {
      setActionBusyId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-secondary tracking-tighter mb-2 uppercase">
            Applicant Management
          </h1>
          <p className="text-gray-400 font-medium italic">
            Chọn tin tuyển dụng → xem ứng viên → accept/reject
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-4">
          <Card className="p-6 shadow-xl shadow-secondary/5 border-gray-50">
            <div className="flex items-center gap-3 mb-5">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-secondary uppercase tracking-widest">
                Job list
              </h2>
            </div>

            {loadState === "loading" && (
              <div className="flex items-center gap-3 text-gray-500 font-bold py-10 justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
                Đang tải...
              </div>
            )}

            {loadState !== "loading" && jobs.length === 0 && (
              <div className="text-gray-500 font-bold py-10 text-center">
                Chưa có tin tuyển dụng.
              </div>
            )}

            <div className="space-y-3">
              {jobs.map((job) => {
                const active = job.id === selectedJobId;
                return (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={
                      active
                        ? "w-full text-left bg-primary/10 border-2 border-primary rounded-[1.25rem] p-4 transition"
                        : "w-full text-left bg-white border-2 border-gray-100 rounded-[1.25rem] p-4 hover:border-primary/30 transition"
                    }
                  >
                    <div className="font-black text-secondary truncate">{job.title}</div>
                    <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      {job.status ?? "DRAFT"}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="xl:col-span-8">
          <Card className="p-6 shadow-xl shadow-secondary/5 border-gray-50">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-black text-secondary uppercase tracking-widest">
                    Applicants
                  </h2>
                  <p className="text-sm font-bold text-gray-400">
                    {selectedJob ? `Tin: ${selectedJob.title}` : "Chọn tin để xem ứng viên"}
                  </p>
                </div>
              </div>

              {selectedJob && (
                <div className="text-sm font-black text-gray-400">
                  {applicants.length} ứng viên
                </div>
              )}
            </div>

            {loadState === "loading" && (
              <div className="flex items-center gap-3 text-gray-500 font-bold py-10 justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
                Đang tải ứng viên...
              </div>
            )}

            {loadState !== "loading" && applicants.length === 0 && (
              <div className="text-gray-500 font-bold py-10 text-center">
                Chưa có ứng viên nào cho tin này.
              </div>
            )}

            <div className="space-y-4">
              {applicants.map((app) => {
                const applicationId = app.id ?? app.applicationId ?? "";
                const candidate = app.user ?? app.candidate;
                const status = app.status ?? "SUBMITTED";
                const busy = actionBusyId === applicationId;

                return (
                  <div
                    key={applicationId || Math.random().toString()}
                    className="bg-white border-2 border-gray-100 rounded-[1.25rem] p-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-black text-secondary truncate">
                          {candidate?.fullName ?? "Candidate"}
                        </div>
                        <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1 truncate">
                          {candidate?.email ?? ""}
                        </div>
                        <div className="text-sm font-bold text-gray-500 mt-3">
                          Status: <span className="text-secondary">{status}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="primary"
                          className="rounded-2xl px-5 py-3"
                          disabled={busy || !applicationId}
                          onClick={() => applicationId && onAccept(applicationId)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Accept
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-2xl px-5 py-3 border-2 border-red-200 hover:bg-red-50"
                          disabled={busy || !applicationId}
                          onClick={() => applicationId && onReject(applicationId)}
                        >
                          <XCircle className="w-4 h-4 mr-2 text-red-500" />
                          Reject
                        </Button>
                      </div>
                    </div>

                    {busy && (
                      <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-4">
                        Đang xử lý...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
