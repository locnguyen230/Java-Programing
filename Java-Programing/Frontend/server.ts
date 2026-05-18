import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Google Generative AI setup
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Advanced Auth Simulation Endpoints
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    
    // Multi-role mock logic
    const roles: Record<string, any> = {
      "candidate@example.com": { id: "1", name: "John Pro", role: "CANDIDATE" },
      "vuxhide@gmail.com": { id: "1", name: "John Pro", role: "CANDIDATE" },
      "recruiter@example.com": { id: "2", name: "Jane Hire", role: "RECRUITER", companyName: "TechCorp" },
      "admin@careermate.com": { id: "3", name: "Root Administrator", role: "ADMIN" }
    };

    if (roles[email] && (password === "123" || (email === "admin@careermate.com" && password === "AdminPassword123"))) {
      return res.json({
        user: roles[email],
        accessToken: `mock-access-token-${roles[email].role.toLowerCase()}-${Date.now()}`,
        refreshToken: "mock-refresh-token"
      });
    }
    res.status(401).json({ message: "Security authentication failed. Invalid protocol." });
  });

  app.post("/api/auth/google", (req, res) => {
    const { token, email, name, avatar } = req.body || {};

    console.log("[MockServer] POST /api/auth/google body =", {
      hasToken: !!token,
      email,
      name,
      avatarPresent: !!avatar,
    });

    // Mock: auto-create user if not exists
    const role = "CANDIDATE";

    if (!token || !email) {
      return res.status(400).json({ message: "Invalid google request" });
    }

    return res.json({
      user: {
        id: Date.now().toString(),
        name: name || email.split("@")[0],
        email,
        role,
        avatar: avatar || null,
        provider: "GOOGLE"
      },
      accessToken: `mock-access-token-google-${Date.now()}`,
      refreshToken: "mock-refresh-token"
    });
  });

  app.post("/api/auth/register", (req, res) => {
    const { email, fullName, role, companyName } = req.body;
    // Simulate successful registration
    res.json({
      user: { id: Date.now().toString(), name: fullName, email, role, companyName },
      accessToken: `mock-access-token-${role.toLowerCase()}-${Date.now()}`,
      refreshToken: "mock-refresh-token"
    });
  });

  app.post("/api/auth/refresh", (req, res) => {
    // In a real app, verify the refreshToken cookie here
    res.json({
      accessToken: `mock-refreshed-token-${Date.now()}`
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.json({ message: "Successfully logged out" });
  });

  app.post("/api/auth/forgot-password", (req, res) => {
    res.json({ message: "Recovery link dispatched" });
  });

  // VIP & Payment Endpoints
  const transactions: Record<string, any> = {};

  app.get("/api/vip/plans", (req, res) => {
    res.json({
      data: [
        {
          id: "free",
          name: "Basic Free",
          price: 0,
          duration: "MONTHLY",
          features: ["Standard job search", "Basic AI CV tips", "Limit 1 CV analysis/day"],
          recommended: false
        },
        {
          id: "monthly",
          name: "Standard Monthly",
          price: 9.99,
          duration: "MONTHLY",
          features: ["Phân tích 50 CV/tháng", "AI Coach cơ bản", "Hỗ trợ email"],
          recommended: false
        },
        {
          id: "yearly",
          name: "Professional Yearly",
          price: 99.99,
          duration: "YEARLY",
          features: ["Phân tích CV không giới hạn", "AI Coach 24/7", "Ưu tiên việc làm mới", "Chứng chỉ VIP badge"],
          recommended: true
        }
      ]
    });
  });

  app.post("/api/payments/create", (req, res) => {
    const { amount, paymentType } = req.body;
    const transactionId = `trans_${Math.random().toString(36).substring(7).toUpperCase()}`;
    const BANK_BIN = "970422";
    const ACCOUNT_NUMBER = "0356789123";
    const ACCOUNT_NAME = "CAREERMATE GLOBAL";

    const qrUrl = `https://img.vietqr.io/image/${BANK_BIN}-${ACCOUNT_NUMBER}-compact.png?amount=${amount}&addInfo=${transactionId}&accountName=${ACCOUNT_NAME}`;

    const transaction = {
      id: transactionId,
      amount,
      paymentType,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };
    transactions[transactionId] = transaction;

    res.json({
      data: {
        transactionId,
        qrUrl,
        amount,
        bankBin: BANK_BIN,
        accountNumber: ACCOUNT_NUMBER,
        accountName: ACCOUNT_NAME
      }
    });
  });

  app.post("/api/payments/confirm/:id", (req, res) => {
    const { id } = req.params;
    if (transactions[id]) {
      transactions[id].status = "SUCCESS";
    }
    res.json({ data: "Payment confirmed successfully" });
  });

  app.post("/api/payments/webhook/:id", (req, res) => {
    const { id } = req.params;
    if (transactions[id]) {
      transactions[id].status = "SUCCESS";
    }
    res.json({ data: "Webhook processed" });
  });

  app.get("/api/payments/:id", (req, res) => {
    const { id } = req.params;
    const transaction = transactions[id];
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ data: transaction });
  });

  app.get("/api/ai/analyze-cv", async (req, res) => {
    try {
      const { text } = req.body;
      const prompt = `Analyze this CV text and provide a summary of skills, experience, and suggestions for improvement. Format as JSON with fields: summary, skills (array), strengths (array), improvements (array), score (0-100).\n\nCV Text: ${text}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonStr = response.text().replace(/```json|```/g, "").trim();
      res.json(JSON.parse(jsonStr));
    } catch (error) {
      console.error("AI Analysis error:", error);
      res.status(500).json({ error: "Failed to analyze CV" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const result = await model.generateContent(`You are a career expert assistant for the CareerMate platform. Answer the following user query: ${message}`);
      const response = await result.response;
      res.json({ message: response.text() });
    } catch (error) {
      res.status(500).json({ error: "Failed to get career advice" });
    }
  });

  // Mock Job Data from Image
  const jobs = [
    { 
      id: "1", 
      title: "Nhân Viên Kinh Doanh - Tư Vấn (Lĩnh Vực Fitness)", 
      company: "Công ty Cổ phần Welly Fitness", 
      location: "Hà Nội", 
      salary: "Từ 20 triệu", 
      category: "Sales", 
      status: "APPROVED", 
      applicants: 42,
      logoColor: "orchid"
    },
    { 
      id: "2", 
      title: "Kỹ Sư Giám Sát Công Trình - Lương Từ 12tr - 25tr", 
      company: "KODSDOOR VIỆT NAM", 
      location: "Hà Nội", 
      salary: "12 - 25 triệu", 
      category: "Technical/Engineering", 
      status: "APPROVED", 
      applicants: 15,
      logoColor: "crimson"
    },
    { 
      id: "3", 
      title: "Kiến Trúc Sư Concept", 
      company: "CP ĐẦU TƯ VÀ THƯƠNG MẠI HÙNG", 
      location: "Hà Nội", 
      salary: "25 - 35 triệu", 
      category: "Administrative/Office", 
      status: "APPROVED", 
      applicants: 28,
      logoColor: "orange"
    },
    { 
      id: "4", 
      title: "Giám Đốc Phòng Giao Dịch - Chi Nhánh Sóc Trăng", 
      company: "Ngân hàng Thương mại CP Lộc Phát", 
      location: "Cần Thơ", 
      salary: "Thoả thuận", 
      category: "Finance/Accounting", 
      status: "APPROVED", 
      applicants: 10,
      logoColor: "brown"
    },
    { 
      id: "5", 
      title: "Trưởng Phòng Marketing (Marketing Manager) - Đà Nẵng", 
      company: "CÔNG TY TNHH ECOPARROTS", 
      location: "Đà Nẵng", 
      salary: "15 - 18 triệu", 
      category: "Marketing/PR", 
      status: "APPROVED", 
      applicants: 35,
      logoColor: "red"
    },
    { 
      id: "6", 
      title: "BIM MANAGER (4 Months Contract)", 
      company: "CÔNG TY TNHH SOCOTEC VIỆT NAM", 
      location: "Hà Nội", 
      salary: "40 - 50 triệu", 
      category: "Administrative/Office", 
      status: "APPROVED", 
      applicants: 7,
      logoColor: "blue"
    },
    { 
      id: "7", 
      title: "Nhân Viên Kinh Doanh Bất Động Sản Tại HCM", 
      company: "CÔNG TY CP BẤT ĐỘNG SẢN FIVE STAR", 
      location: "Hồ Chí Minh", 
      salary: "Thoả thuận", 
      category: "Sales", 
      status: "APPROVED", 
      applicants: 56,
      logoColor: "red"
    },
    { 
      id: "8", 
      title: "Nhân Viên Thiết Kế Nội Thất - Biên Hòa", 
      company: "CÔNG TY TNHH RI TA VÕ", 
      location: "Đồng Nai", 
      salary: "10 - 12 triệu", 
      category: "Administrative/Office", 
      status: "APPROVED", 
      applicants: 19,
      logoColor: "maroon"
    },
  ];

  app.get("/api/jobs", (req, res) => {
    res.json(jobs.filter(j => j.status === "APPROVED"));
  });

  // ============================================================
  // Job Search / Trending endpoints (used by JobSearch.tsx)
  // ============================================================
  const toJobCard = (job: any) => ({
    id: job.id,
    title: job.title,
    description: job.description ?? job.category ?? "",
    requirements: job.requirements ?? "",
    minSalary: job.minSalary,
    maxSalary: job.maxSalary,
    salaryUnit: job.salaryUnit ?? "VND",
    location: job.location ?? "",
    experience: job.experience ?? "",
    employmentType: job.employmentType ?? "FULL_TIME",
    skills: job.skills ?? (job.category ? `${job.category}` : "Java, Spring Boot"),
    createdAt: job.createdAt ?? new Date().toISOString(),
    deadline: job.deadline ?? "20/05/2026",
    viewCount: job.viewCount ?? 0,
    applicantCount: job.applicants ?? job.applicantCount ?? 0,
    company: {
      id: String(job.companyId ?? job.id),
      name: job.company ?? "Company",
      description: job.companyDescription ?? "",
      logoUrl: job.logoUrl ?? "",
    },
    isSaved: false,

    // extra fields that UI might read
    category: job.category
  });

  app.get("/api/jobs/trending/list", (req, res) => {
    const list = jobs.filter((j) => j.status === "APPROVED").slice(0, 8).map(toJobCard);
    res.json({ data: list });
  });

  app.get("/api/jobs/search/trending", (req, res) => {
    res.json({ data: ["Java", "React", "Spring Boot", "SQL", "Docker", "TypeScript"] });
  });

  app.get("/api/jobs/search/suggestions", (req, res) => {
    const prefix = String(req.query.prefix ?? "").toLowerCase();
    const all = ["Java Backend Developer", "React Frontend", "Spring Boot Engineer", "SQL Analyst", "DevOps"];
    const filtered = !prefix ? all : all.filter((s) => s.toLowerCase().includes(prefix)).slice(0, 5);
    res.json({ data: filtered });
  });

  app.get("/api/jobs/search/recent", (req, res) => {
    res.json({ data: ["Java", "React", "Spring Boot"] });
  });

  app.get("/api/jobs/search/advanced", (req, res) => {
    const page = Number(req.query.page ?? 0);
    const size = Number(req.query.size ?? 10);

    // In mock: ignore filters and just return approved jobs
    const content = jobs.filter((j) => j.status === "APPROVED").map(toJobCard);

    const start = page * size;
    const slice = content.slice(start, start + size);

    const totalElements = content.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));

    res.json({
      data: {
        content: slice,
        page,
        size,
        totalElements,
        totalPages,
        hasNext: page < totalPages - 1,
        hasPrevious: page > 0,
      },
    });
  });

  // Admin Mock Data
  app.get("/api/admin/stats", (req, res) => {
    res.json({
      totalUsers: 1240,
      activeUsers: 850,
      totalJobs: 45,
      revenue: 15400,
      revenueData: [
        { name: "Jan", amount: 2400 },
        { name: "Feb", amount: 1398 },
        { name: "Mar", amount: 9800 },
        { name: "Apr", amount: 3908 },
        { name: "May", amount: 4800 },
      ],
      userGrowth: [
        { name: "Jan", users: 400 },
        { name: "Feb", users: 600 },
        { name: "Mar", users: 800 },
        { name: "Apr", users: 1000 },
        { name: "May", users: 1240 },
      ]
    });
  });

  app.get("/api/admin/users", (req, res) => {
    res.json([
      { id: "1", name: "John Candidate", email: "candidate@example.com", role: "CANDIDATE", status: "ACTIVE" },
      { id: "2", name: "Jane Recruiter", email: "recruiter@example.com", role: "RECRUITER", status: "ACTIVE" },
      { id: "3", name: "Bad Actor", email: "bad@example.com", role: "CANDIDATE", status: "BANNED" },
    ]);
  });

  app.get("/api/admin/jobs", (req, res) => {
    res.json(jobs);
  });

  // ============================================================
  // Employer / Recruiter Mock Endpoints (used by JobApplicantsManagement.tsx)
  // ============================================================

  // In this mock:
  // - recruiter is identified by x-user-email/x-user-id headers (see getCandidateFromReq)
  // - we don't persist ownership; we just return mock jobs & applicants
  // - applicants are stored in applicationStore created by /api/jobs/:id/apply
  const getRecruiterIdentity = (req: any) => {
    const userEmail = req.headers["x-user-email"] as string | undefined;
    const userId = req.headers["x-user-id"] as string | undefined;
    if (!userId || !userEmail) return null;
    return { userId, userEmail };
  };

  app.get("/api/jobs/employer/jobs", (req, res) => {
    // Mock: không cần auth headers
    const employerJobs = jobs.map((j) => ({
      id: j.id,
      title: j.title,
      status: "PUBLISHED",
      deleted: false,
      company: {
        id: "comp_1",
        name: "TechCorp",
        logoUrl: "",
      },
      createdAt: new Date().toISOString(),
      deadline: "20/05/2026",
    }));

    res.json({ data: employerJobs });
  });

  app.get("/api/jobs/employer/jobs/:jobId/applicants", (req, res) => {
    // Mock: không cần auth headers
    const { jobId } = req.params;

    // Nếu chưa có applicants từ /api/jobs/:id/apply thì trả rỗng (vẫn OK cho UI)
    const apps = Object.values(applicationStore)
      .filter((a) => a.jobId === jobId)
      .map((a) => ({
        id: a.id,
        applicationId: a.id,
        status: a.status,
        appliedAt: a.createdAt,
        cvUrl: a.cvUrl ?? null,
        coverLetter: null,
        phoneNumber: null,
        user: {
          userId: a.userId,
          fullName: a.userName,
          email: a.userEmail,
          phoneNumber: null,
        },
      }));

    res.json({ data: apps });
  });

  app.post("/api/jobs/employer/applications/:applicationId/accept", (req, res) => {
    const { applicationId } = req.params;
    const appEntity = applicationStore[applicationId];
    if (!appEntity) return res.status(404).json({ message: "Application not found" });

    appEntity.status = "ACCEPTED";
    addHistory(appEntity, "ACCEPTED", "Recruiter accepted (stub)");
    return res.json({ data: null });
  });

  app.post("/api/jobs/employer/applications/:applicationId/reject", (req, res) => {
    const { applicationId } = req.params;
    const appEntity = applicationStore[applicationId];
    if (!appEntity) return res.status(404).json({ message: "Application not found" });

    appEntity.status = "REJECTED";
    addHistory(appEntity, "REJECTED", "Recruiter rejected (stub)");
    return res.json({ data: null });
  });

  app.get("/api/jobs/:id", (req, res) => {
    const { id } = req.params;
    const job = jobs.find(j => j.id === id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const candidate = getCandidateFromReq(req);

    const applied =
      !!candidate &&
      Object.values(applicationStore).some(a => a.userId === candidate.userId && a.jobId === id);

    // Enrich job with more details for the detail page
    const detailedJob = {
      ...job,
      applied,
      requirements: [
        "Không yêu cầu kinh nghiệm",
        "Đại học trở lên",
        "Có tư duy tốt về thẩm mỹ và kiến trúc",
        "Thành thạo AutoCAD, 3dsMax hoặc Revit",
        "Kỹ năng làm việc nhóm tốt"
      ],
      categories: ["Kiến trúc sư", "Xây dựng", "Thiết kế"],
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400",
      ],
      level: "Nhân viên",
      education: "Đại học trở lên",
      quantity: 6,
      type: "Toàn thời gian",
      deadline: "20/05/2026",
      isPremium: id === "3", // Match the Home screen highlight logic
    };

    res.json(detailedJob);
  });

  // ============================================================
  // Job Application Confirmation System (Stage 1 - Backend core)
  // ============================================================

  type ApplicationStatus = "PENDING" | "REVIEWING" | "INTERVIEW" | "REJECTED" | "ACCEPTED";

  type ApplicationStatusHistory = {
    id: string;
    applicationId: string;
    status: ApplicationStatus;
    note?: string;
    createdAt: string;
    updatedAt: string;
  };

  type Application = {
    id: string; // unique applicationId exposed to client
    userId: string;
    userName: string;
    userEmail: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    cvUrl?: string | null;
    status: ApplicationStatus;
    createdAt: string;
    updatedAt: string;
  };

  const applicationStore: Record<string, Application> = {};
  const applicationStatusHistoryStore: Record<string, ApplicationStatusHistory[]> = {};

  const makeId = (prefix: string) => {
    const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
    return `${prefix}_${Date.now()}_${rand}`;
  };

  const getCandidateFromReq = (req: any) => {
    // In this mock server we map to roles used in /api/auth/login:
    // token is not parsed; instead, frontend will rely on current logged-in user in mock.
    // For simplicity, we accept "x-user-id" and "x-user-email" headers if provided.
    const userId = req.headers["x-user-id"] as string | undefined;
    const email = req.headers["x-user-email"] as string | undefined;
    if (!userId || !email) return null;
    const name = (req.headers["x-user-name"] as string | undefined) || "Candidate";
    return { userId, email, name };
  };

  const jobAvailabilityCheck = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return null;
    // stub: always available if approved
    return job;
  };

  const sendConfirmationEmailStub = async (app: Application) => {
    const html = `
      <!doctype html>
      <html>
        <body style="font-family:Arial,sans-serif;">
          <div style="max-width:680px;margin:0 auto;padding:24px;">
            <h2 style="margin:0 0 12px 0;">Application Confirmation</h2>
            <p style="margin:0 0 18px 0;color:#444;">
              Hi <b>${app.userName}</b>, your application has been received successfully.
            </p>

            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
              <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Application ID</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;"><b>${app.id}</b></td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Job Title</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;"><b>${app.jobTitle}</b></td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Company</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;"><b>${app.companyName}</b></td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Application Date</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;"><b>${new Date(app.createdAt).toLocaleString()}</b></td></tr>
              <tr><td style="padding:10px 0;color:#666;">Status</td><td style="padding:10px 0;color:#111;"><b>${app.status}</b></td></tr>
            </table>

            <p style="margin:18px 0 0 0;color:#666;">
              Thank you for applying to CareerMate.
            </p>
          </div>
        </body>
      </html>
    `;
    // Stub: log only
    console.log("[EmailConfirmationStub] To:", app.userEmail);
    console.log("[EmailConfirmationStub] Subject: Application Confirmation - " + app.id);
    console.log("[EmailConfirmationStub] HTML:", html);
  };

  const addHistory = (app: Application, status: ApplicationStatus, note?: string) => {
    const now = new Date().toISOString();
    const entry: ApplicationStatusHistory = {
      id: makeId("hist"),
      applicationId: app.id,
      status,
      note,
      createdAt: now,
      updatedAt: now,
    };
    if (!applicationStatusHistoryStore[app.id]) applicationStatusHistoryStore[app.id] = [];
    applicationStatusHistoryStore[app.id].push(entry);
  };

  const preventDuplicate = (userId: string, jobId: string) => {
    const existing = Object.values(applicationStore).find(a => a.userId === userId && a.jobId === jobId);
    return existing || null;
  };

  // Adapter endpoint used by existing frontend: POST /api/jobs/:id/apply
  app.post("/api/jobs/:id/apply", (req, res) => {
    const { id: jobId } = req.params;
    const candidate = getCandidateFromReq(req);

    if (!candidate) {
      return res.status(401).json({ message: "User not authenticated (mock). Provide x-user-id/x-user-email headers." });
    }

    const job = jobAvailabilityCheck(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const duplicate = preventDuplicate(candidate.userId, jobId);
    if (duplicate) {
      return res.status(409).json({
        message: "You already applied for this job"
      });
    }

    const appId = makeId("app");
    const now = new Date().toISOString();

    const newApp: Application = {
      id: appId,
      userId: candidate.userId,
      userName: candidate.name,
      userEmail: candidate.email,
      jobId,
      jobTitle: job.title,
      companyName: job.company,
      cvUrl: null,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    applicationStore[appId] = newApp;
    applicationStatusHistoryStore[appId] = [];

    // initial history
    addHistory(newApp, "PENDING", "Application submitted");

    // auto transition stub (keep internal status behavior)
    const next1: ApplicationStatus = "REVIEWING";
    newApp.status = next1;
    newApp.updatedAt = new Date().toISOString();
    addHistory(newApp, next1, "Under review");

    const finalStatus: ApplicationStatus = Math.random() > 0.7 ? "REJECTED" : "ACCEPTED";
    newApp.status = finalStatus;
    newApp.updatedAt = new Date().toISOString();
    addHistory(
      newApp,
      finalStatus,
      finalStatus === "ACCEPTED" ? "Candidate accepted (stub)" : "Candidate rejected (stub)"
    );

    sendConfirmationEmailStub(newApp).catch(() => {});

    // Spec response for frontend realtime applied state
    return res.json({
      success: true,
      message: "Application submitted successfully",
      jobId,
      applied: true,
      applicationStatus: "APPLIED"
    });
  });

  // Spec endpoints (use the same underlying store)
  app.post("/api/applications/apply", (req, res) => {
    const { jobId, cvUrl } = req.body || {};
    const candidate = getCandidateFromReq(req);

    if (!candidate) {
      return res.status(401).json({ message: "User not authenticated (mock)." });
    }
    if (!jobId) return res.status(400).json({ message: "jobId is required" });

    const job = jobAvailabilityCheck(String(jobId));
    if (!job) return res.status(404).json({ message: "Job not found" });

    const duplicate = preventDuplicate(candidate.userId, String(jobId));
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate application prevented", data: duplicate });
    }

    const appId = makeId("app");
    const now = new Date().toISOString();

    const newApp: Application = {
      id: appId,
      userId: candidate.userId,
      userName: candidate.name,
      userEmail: candidate.email,
      jobId: String(jobId),
      jobTitle: job.title,
      companyName: job.company,
      cvUrl: cvUrl ?? null,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    applicationStore[appId] = newApp;
    applicationStatusHistoryStore[appId] = [];

    addHistory(newApp, "PENDING", "Application submitted");
    newApp.status = "REVIEWING";
    newApp.updatedAt = new Date().toISOString();
    addHistory(newApp, "REVIEWING", "Under review");
    newApp.status = "ACCEPTED";
    newApp.updatedAt = new Date().toISOString();
    addHistory(newApp, "ACCEPTED", "Candidate accepted (stub)");

    sendConfirmationEmailStub(newApp).catch(() => {});

    return res.json({ data: newApp });
  });

  app.get("/api/applications/:id", (req, res) => {
    const { id } = req.params;
    const candidate = getCandidateFromReq(req);
    const app = applicationStore[id];
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (candidate && app.userId !== candidate.userId) return res.status(403).json({ message: "Forbidden" });

    res.json({
      data: {
        ...app,
        statusHistory: applicationStatusHistoryStore[id] || []
      }
    });
  });

  app.get("/api/applications/candidate/:candidateId", (req, res) => {
    const { candidateId } = req.params;
    const candidate = getCandidateFromReq(req);
    if (!candidate) return res.status(401).json({ message: "User not authenticated (mock)." });
    if (candidate.userId !== candidateId) return res.status(403).json({ message: "Forbidden" });

    const list = Object.values(applicationStore)
      .filter(a => a.userId === candidateId)
      .map(a => ({
        ...a,
        statusHistory: applicationStatusHistoryStore[a.id] || []
      }));

    res.json({ data: list });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Let Vite handle SPA fallback in dev
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
