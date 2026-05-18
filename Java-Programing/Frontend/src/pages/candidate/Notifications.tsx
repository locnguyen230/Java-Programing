import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Bell, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  getMyNotifications,
  NotificationDetailDto,
} from "../../services/applicationService";

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [items, setItems] = useState<NotificationDetailDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await getMyNotifications(0, 30);
      setItems(res || []);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "Failed to load notifications";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const title = useMemo(() => {
    const count = items.length;
    return `Notifications (${count})`;
  }, [items.length]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all"
            onClick={() => navigate("/jobs")}
          >
            ← Back to Jobs
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-secondary leading-tight">
                Notifications
              </h1>
              <p className="text-gray-500 font-bold">{title}</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading notifications...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-[2rem] p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-black text-red-900 mb-1">Load failed</h3>
                <p className="text-red-700 font-bold">{error}</p>
                <button
                  onClick={load}
                  className="mt-4 px-5 py-3 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest text-xs hover:bg-red-700 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] shadow-xl p-10 text-center">
            <Clock className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500 font-medium mb-8">
              When recruiters receive your application, they’ll show up here.
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="px-7 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:opacity-90 transition"
            >
              Browse Jobs
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="space-y-4">
            {items.map((n) => {
              const app = n.application;
              const status = (app?.status || n.status || "").toString();

              const isSubmitted = status === "SUBMITTED";
              const isAccepted = status === "ACCEPTED";

              const statusBadge =
                isAccepted ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-emerald-600/20 bg-emerald-600/10 text-emerald-700 font-black text-xs uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" />
                    Success
                  </span>
                ) : isSubmitted ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-amber-600/20 bg-amber-600/10 text-amber-800 font-black text-xs uppercase tracking-widest">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    SUBMITTED
                  </span>
                ) : (
                  <span className="inline-flex px-3 py-1 rounded-full border-2 border-gray-200 bg-gray-100 text-gray-700 font-black text-xs uppercase tracking-widest">
                    {status || "UNKNOWN"}
                  </span>
                );

              const appliedDate = app?.appliedAt
                ? new Date(app.appliedAt).toLocaleDateString()
                : "—";

              return (
                <div
                  key={n.notificationId}
                  className="bg-white border-2 border-gray-100 rounded-[2.5rem] shadow-xl p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-secondary truncate">
                        {app?.job?.title || "Unknown job"}
                      </h3>
                      <p className="text-gray-500 font-bold mt-1">
                        {app?.job?.company?.name || "Unknown company"}
                      </p>

                      <div className="flex items-center gap-3 mt-4 flex-wrap">
                        {statusBadge}
                        <div className="flex items-center gap-2 text-gray-500 font-bold">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs uppercase tracking-widest">
                            Applied: {appliedDate}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 text-gray-600 font-bold text-sm">
                        {n.message || "Nhà tuyển dụng đã nhận được hồ sơ của bạn."}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Application status
                      </p>
                      <p className="text-gray-900 font-black mt-1">{status || "—"}</p>

                      <button
                        className="mt-4 px-5 py-3 rounded-xl bg-gray-900 text-white font-black uppercase tracking-widest text-xs hover:bg-black transition"
                        onClick={() => {
                          // For now, open My Applications list to satisfy "click to view detail"
                          navigate("/my-applications");
                          toast.success("Mở My Applications để xem chi tiết.");
                        }}
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
