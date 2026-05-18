# CareerMate Backend (Spring Boot 3 + Java 21)

## 1) Mục tiêu hệ thống

Backend này cung cấp REST API phục vụ Frontend React trong dự án `Frontend/`.

Các nhóm chức năng (theo Frontend):

- Auth & Role: ADMIN / RECRUITER / CANDIDATE (JWT, Stateless)
- Candidate: jobs, job detail, saved jobs, apply, notifications, my applications
- Recruiter: employer jobs, manage applicants, accept/reject application, post/publish job
- Admin: stats, users, jobs moderation
- AI: analyze CV, chat, career/search-direction
- VIP/Payment: plans, create payment, confirm/payment status, subscription

> Lưu ý: File này là **template scaffolding** + hướng dẫn chạy. Bạn sẽ cần tạo code phía dưới theo kiến trúc package mà mình mô tả.

---

## 2) Yêu cầu (Requirements)

- Java 21
- Maven 3.9+
- Git (tuỳ chọn)

---

## 3) Tạo backend project

Trong thư mục `backend/` chạy:

### 3.1. Tạo bằng Spring Initializr (khuyến nghị)

- Group: `com.creear`
- Artifact: `career-mate-backend`
- Java: 21
- Spring Boot: 3.x

Chọn dependencies:

- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL Driver (hoặc MySQL)
- Validation
- Lombok
- MapStruct
- Flyway hoặc Liquibase (tuỳ chọn)
- Springdoc OpenAPI (Swagger)

---

## 4) Chạy ứng dụng (Run)

### 4.1. Cấu hình environment variables

Tạo file `.env` ở **gốc** `Frontend/` (cùng cấp với `backend/`) hoặc tại thư mục chạy.

Ví dụ: `.env`

```env
DB_URL=jdbc:postgresql://localhost:5432/careermate
DB_USERNAME=careermate
DB_PASSWORD=careermate
DB_DIALECT=org.hibernate.dialect.PostgreSQLDialect

JWT_SECRET=change-me-please
JWT_ACCESS_TOKEN_TTL_MS=3600000
JWT_REFRESH_TOKEN_TTL_MS=2592000000

SPRING_PROFILES_ACTIVE=dev

# Nếu dùng OAuth2/Google token verification
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Payment providers (nếu backend thật)
PAYMENT_API_KEY=
PAYMENT_WEBHOOK_SECRET=

# Base URL backend (nếu cần CORS)
FRONTEND_ORIGIN=http://localhost:5173
```

### 4.2. application.yml

Backend sẽ đọc biến từ môi trường thông qua `${VAR_NAME}`.

Bạn cần tạo file:

- `backend/src/main/resources/application.yml`

---

## 5) Build & Run với Maven

Từ thư mục `backend/`:

### Build:

```bash
mvn clean package -DskipTests
```

### Run:

```bash
mvn spring-boot:run
```

---

## 6) Swagger / OpenAPI

Thường truy cập:

- http://localhost:8080/swagger-ui.html
- http://localhost:8080/v3/api-docs

---

## 7) Các endpoint chính (mapping theo Frontend)

> Backend cần implement theo các service endpoints đã reverse từ Frontend.

- Auth
  - POST /api/auth/login
  - POST /api/auth/google
  - POST /api/auth/register
  - POST /api/auth/logout
  - POST /api/auth/refresh
  - POST /api/auth/forgot-password
  - POST /api/auth/reset-password

- Jobs (Candidate)
  - GET /api/jobs
  - GET /api/jobs/{id}
  - GET /api/jobs/search/advanced?....
  - GET /api/jobs/trending/list
  - GET /api/jobs/search/trending
  - GET /api/jobs/search/suggestions?prefix=...
  - GET /api/jobs/search/recent
  - POST /api/jobs/{jobId}/save
  - DELETE /api/jobs/{jobId}/save
  - GET /api/jobs/saved/list?page&size
  - POST /api/jobs/{id}/apply

- Applications / Notifications
  - GET /api/notifications/me?page&size
  - GET /api/notifications/{notificationId}
  - GET /api/applications/me?page&size

- Recruiter
  - GET /api/jobs/employer/jobs
  - GET /api/jobs/employer/jobs/{jobId}/applicants
  - POST /api/jobs/employer/applications/{applicationId}/accept
  - POST /api/jobs/employer/applications/{applicationId}/reject
  - POST /api/jobs/employer/jobs
  - POST /api/jobs/employer/jobs/{jobId}/publish

- Admin
  - GET /api/admin/stats
  - GET /api/admin/users
  - GET /api/admin/jobs
  - DELETE /api/admin/users/{id}
  - PATCH /api/admin/jobs/{id}/approve

- AI
  - POST /api/ai/analyze-cv
  - POST /api/ai/chat
  - POST /api/career/search-direction

- VIP / Payment
  - GET /api/vip/plans
  - POST /api/payments/create
  - POST /api/payments/confirm/{transactionId}
  - POST /api/payments/webhook/{transactionId}
  - GET /api/payments/{transactionId}
  - GET /api/vip/my-subscription

---

## 8) Checklist triển khai theo tiêu chuẩn cao cấp (gợi ý)

Khi bạn bắt đầu code trong backend, mình sẽ scaffold theo cấu trúc package:

- `com.creear.controller`
- `com.creear.service` (interface + impl)
- `com.creear.repository`
- `com.creear.entity`
- `com.creear.dto` (RequestDTO/ResponseDTO)
- `com.creear.config` (Security, Swagger)
- `com.creear.security` (JWT/OAuth)
- `com.creear.exception`
- `com.creear.mapper` (MapStruct)

Sau đó implement:

- JWT stateless filter
- Global exception handler
- Validation + @Valid
- JPA auditing createdAt/updatedAt
- Logging @Slf4j
- Liquibase/Flyway migrations

---

## 9) Chú ý quan trọng

Hiện tại trong repo Frontend, chưa có folder backend code Java Spring Boot.
File này chỉ là hướng dẫn chạy + tạo cấu trúc.
