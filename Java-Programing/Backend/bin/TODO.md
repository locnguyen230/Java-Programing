# Backend TODO - CareerMate

## Step 1: Bootstrap dự án

- [ ] Tạo class main `CreearBackendApplication`.
- [ ] Tạo cấu trúc package theo yêu cầu (controller/service/repository/entity/dto/config/security/exception/mapper).

## Step 2: Cấu hình

- [ ] Tạo `application.yml` tham chiếu env variables.
- [ ] Cấu hình JPA Auditing (createdAt/updatedAt).
- [ ] Cấu hình Swagger/OpenAPI.

## Step 3: Security (JWT)

- [ ] Tạo `JwtService` + `JwtAuthenticationFilter`.
- [ ] Tạo `SecurityConfig` phân quyền theo role và permitAll cho auth + swagger.

## Step 4: Persistence layer

- [ ] Tạo entities tối thiểu: User, Job, Application, Notification, SavedJob, VipPlan, PaymentTransaction, Subscription.
- [ ] Tạo repositories tương ứng.

## Step 5: DTO + MapStruct

- [ ] Tạo Request/Response DTO cho các endpoint chính.
- [ ] Tạo mapper MapStruct Entity <-> DTO.

## Step 6: Services

- [ ] Implement AuthService, JobService, ApplicationService, NotificationService, RecruiterService, AdminService, AiService, VipService, PaymentService.
- [ ] AI/Payment: triển khai chạy được (stub/mocked) theo format frontend.

## Step 7: Controllers (RESTful)

- [ ] Tạo các RestController theo đúng route Frontend gọi.
- [ ] Chuẩn hoá response wrapper `{success, message, data}`.

## Step 8: Exception handling

- [ ] GlobalExceptionHandler bằng `@RestControllerAdvice`.

## Step 9: Build & verify

- [ ] `mvn clean package -DskipTests`
- [ ] `mvn spring-boot:run` và check swagger + hit các endpoint smoke test.
