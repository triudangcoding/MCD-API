# API Endpoints Documentation

Tài liệu này mô tả tất cả các API endpoint có sẵn trong hệ thống quản lý lớp học online.

## Base URL

```
http://localhost:9933/api
```

**Lưu ý**: Port mặc định là 9933, có thể thay đổi qua biến môi trường `PORT`.

## Authentication

Hầu hết các endpoint yêu cầu JWT token trong header:

```
Authorization: Bearer <token>
```

Token được lấy từ endpoint `/api/auth/login`.

---

## 1. App Controller

### Health Check

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/` | Kiểm tra trạng thái API | ❌ |

---

## 2. Authentication

### Login

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/auth/login` | Đăng nhập và nhận JWT token | ❌ | - |

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 3. Users

### Quản lý Users

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/users` | Tạo user mới | ✅ | ADMIN |
| GET | `/users` | Lấy danh sách users (có phân trang và filter) | ✅ | ADMIN |
| GET | `/users/statistics` | Lấy thống kê users theo branch | ✅ | ADMIN |
| GET | `/users/branch/:branchId` | Lấy danh sách users theo branch | ✅ | ADMIN |
| GET | `/users/profile` | Lấy thông tin profile của user hiện tại | ✅ | Tất cả |
| GET | `/users/:id` | Lấy thông tin user theo ID | ✅ | ADMIN |
| PATCH | `/users/:id` | Cập nhật thông tin user | ✅ | ADMIN |
| PATCH | `/users/:id/toggle-status` | Bật/tắt trạng thái user | ✅ | ADMIN |
| PATCH | `/users/:id/status` | Cập nhật trạng thái user | ✅ | ADMIN |
| DELETE | `/users/:id` | Xóa user | ✅ | ADMIN |

**Query Parameters cho GET `/users`:**
- `page`: Số trang (mặc định: 1)
- `limit`: Số lượng items mỗi trang (mặc định: 10)
- `role`: Lọc theo role (ADMIN, TEACHER, USER)
- `branchId`: Lọc theo branch ID
- `status`: Lọc theo status
- `keyword`: Tìm kiếm theo từ khóa

---

## 4. Branches

### Quản lý Chi nhánh

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/branches` | Tạo chi nhánh mới | ✅ | ADMIN |
| GET | `/branches` | Lấy danh sách tất cả chi nhánh | ✅ | ADMIN |
| GET | `/branches/my-branch` | Lấy thông tin chi nhánh của user hiện tại | ✅ | Tất cả |
| GET | `/branches/:id` | Lấy thông tin chi nhánh theo ID | ✅ | ADMIN |
| PATCH | `/branches/:id` | Cập nhật thông tin chi nhánh | ✅ | ADMIN |
| DELETE | `/branches/:id` | Xóa chi nhánh | ✅ | ADMIN |

---

## 5. Faculties

### Quản lý Khoa

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/faculties` | Tạo khoa mới | ✅ | ADMIN |
| GET | `/faculties` | Lấy danh sách khoa (có thể filter theo branchId) | ✅ | Tất cả |
| GET | `/faculties/:id` | Lấy thông tin khoa theo ID | ✅ | Tất cả |
| PATCH | `/faculties/:id` | Cập nhật thông tin khoa | ✅ | ADMIN |
| DELETE | `/faculties/:id` | Xóa khoa | ✅ | ADMIN |

**Query Parameters cho GET `/faculties`:**
- `branchId`: Lọc theo branch ID

---

## 6. Subjects

### Quản lý Môn học

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/subjects` | Tạo môn học mới | ✅ | ADMIN |
| GET | `/subjects` | Lấy danh sách môn học (có thể filter theo facultyId) | ✅ | Tất cả |
| GET | `/subjects/:id` | Lấy thông tin môn học theo ID | ✅ | Tất cả |
| PATCH | `/subjects/:id` | Cập nhật thông tin môn học | ✅ | ADMIN |
| DELETE | `/subjects/:id` | Xóa môn học | ✅ | ADMIN |

**Query Parameters cho GET `/subjects`:**
- `facultyId`: Lọc theo faculty ID

---

## 7. Online Classes

### Quản lý Lớp học Online

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/online-classes` | Tạo lớp học mới | ✅ | ADMIN, TEACHER |
| GET | `/online-classes` | Lấy danh sách lớp học (có phân trang và filter) | ✅ | Tất cả |
| GET | `/online-classes/:id` | Lấy thông tin lớp học theo ID | ✅ | Tất cả |
| GET | `/online-classes/:id/members` | Lấy danh sách thành viên của lớp | ✅ | ADMIN, TEACHER |
| PATCH | `/online-classes/:id/members/:memberId/approve` | Duyệt thành viên tham gia lớp | ✅ | ADMIN, TEACHER |
| PATCH | `/online-classes/:id/members/:memberId/reject` | Từ chối thành viên tham gia lớp | ✅ | ADMIN, TEACHER |
| PATCH | `/online-classes/:id` | Cập nhật thông tin lớp học | ✅ | ADMIN, TEACHER |
| DELETE | `/online-classes/:id` | Xóa lớp học | ✅ | ADMIN |

**Query Parameters cho GET `/online-classes`:**
- `page`: Số trang
- `limit`: Số lượng items mỗi trang
- `branchId`: Lọc theo branch ID
- `teacherId`: Lọc theo teacher ID
- `subjectId`: Lọc theo subject ID
- `status`: Lọc theo status

---

## 8. Class Members

### Quản lý Thành viên Lớp

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/class-members/join/:classId` | Tham gia vào lớp học | ✅ | Tất cả |
| GET | `/class-members/my-classes` | Lấy danh sách lớp học của user hiện tại | ✅ | Tất cả |
| DELETE | `/class-members/leave/:classId` | Rời khỏi lớp học | ✅ | Tất cả |

---

## 9. Posts

### Quản lý Bài đăng

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/posts` | Tạo bài đăng mới | ✅ | Tất cả |
| GET | `/posts` | Lấy danh sách bài đăng (có thể filter) | ✅ | Tất cả |
| GET | `/posts/:id` | Lấy thông tin bài đăng theo ID | ✅ | Tất cả |
| PATCH | `/posts/:id` | Cập nhật bài đăng (chỉ owner hoặc ADMIN) | ✅ | Tất cả |
| DELETE | `/posts/:id` | Xóa bài đăng | ✅ | ADMIN |

**Query Parameters cho GET `/posts`:**
- `onlineClassId`: Lọc theo online class ID
- `type`: Lọc theo loại bài đăng

---

## 10. Comments

### Quản lý Bình luận

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/comments` | Tạo bình luận mới | ✅ | Tất cả |
| GET | `/comments/post/:postId` | Lấy danh sách bình luận của một post | ✅ | Tất cả |
| GET | `/comments/:id` | Lấy thông tin bình luận theo ID | ✅ | Tất cả |
| PATCH | `/comments/:id` | Cập nhật bình luận (chỉ owner hoặc ADMIN) | ✅ | Tất cả |
| DELETE | `/comments/:id` | Xóa bình luận (chỉ owner hoặc ADMIN) | ✅ | Tất cả |

---

## 11. Reactions

### Quản lý Reaction (Like/Dislike)

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/reactions/toggle` | Toggle reaction (thêm hoặc xóa reaction) | ✅ | Tất cả |
| GET | `/reactions/post/:postId` | Lấy danh sách reactions của một post | ✅ | Tất cả |
| DELETE | `/reactions/post/:postId` | Xóa reaction của user hiện tại trên post | ✅ | Tất cả |

---

## 12. Lessons

### Quản lý Bài học

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/lessons` | Tạo bài học mới | ✅ | ADMIN, TEACHER |
| GET | `/lessons/class/:classId` | Lấy danh sách bài học của một lớp | ✅ | Tất cả |
| GET | `/lessons/:id` | Lấy thông tin bài học theo ID | ✅ | Tất cả |
| PATCH | `/lessons/:id` | Cập nhật bài học (chỉ owner hoặc ADMIN) | ✅ | ADMIN, TEACHER |
| DELETE | `/lessons/:id` | Xóa bài học (chỉ owner hoặc ADMIN) | ✅ | ADMIN, TEACHER |

---

## 13. Teacher Calendars

### Quản lý Lịch Giáo viên

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/teacher-calendars` | Tạo lịch dạy mới | ✅ | ADMIN, TEACHER |
| GET | `/teacher-calendars` | Lấy danh sách lịch dạy (có thể filter) | ✅ | Tất cả |
| GET | `/teacher-calendars/:id` | Lấy thông tin lịch dạy theo ID | ✅ | Tất cả |
| PATCH | `/teacher-calendars/:id` | Cập nhật lịch dạy (chỉ owner hoặc ADMIN) | ✅ | ADMIN, TEACHER |
| DELETE | `/teacher-calendars/:id` | Xóa lịch dạy (chỉ owner hoặc ADMIN) | ✅ | ADMIN, TEACHER |

**Query Parameters cho GET `/teacher-calendars`:**
- `teacherId`: Lọc theo teacher ID
- `startDate`: Ngày bắt đầu (format: ISO date string)
- `endDate`: Ngày kết thúc (format: ISO date string)

---

## 14. File Resources

### Quản lý File

| Method | Endpoint | Mô tả | Auth Required | Roles |
|--------|----------|-------|---------------|-------|
| POST | `/file-resources` | Tạo file resource mới | ✅ | Tất cả |
| GET | `/file-resources` | Lấy danh sách file resources (có thể filter) | ✅ | Tất cả |
| GET | `/file-resources/:id` | Lấy thông tin file resource theo ID | ✅ | Tất cả |
| DELETE | `/file-resources/:id` | Xóa file resource (chỉ owner) | ✅ | Tất cả |

**Query Parameters cho GET `/file-resources`:**
- `onlineClassId`: Lọc theo online class ID
- `lessonId`: Lọc theo lesson ID
- `uploaderId`: Lọc theo uploader ID

---

## Phân quyền (Roles)

Hệ thống có 3 loại role:

- **ADMIN**: Quyền cao nhất, có thể quản lý tất cả
- **TEACHER**: Giáo viên, có thể tạo và quản lý lớp học, bài học, lịch dạy
- **USER**: Học sinh, có thể tham gia lớp, xem bài học, tương tác (post, comment, reaction)

## Lưu ý

1. Tất cả các endpoint (trừ `/` và `/auth/login`) đều yêu cầu JWT token trong header
2. Một số endpoint yêu cầu quyền cụ thể (ADMIN, TEACHER) được ghi rõ trong bảng
3. Endpoint có ghi "chỉ owner" nghĩa là chỉ người tạo mới có quyền chỉnh sửa/xóa
4. Format response mặc định được chuẩn hóa bởi `TransformResponseInterceptor`
5. Tất cả các request body đều được validate bởi `ValidationPipe`

## Testing

Bạn có thể sử dụng Postman collection có sẵn trong file `postman_collection.json` để test các API endpoint.

