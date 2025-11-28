# Hướng dẫn sử dụng Postman Collection

## Import Collection và Environment

### 1. Import Collection
1. Mở Postman
2. Click vào **Import** ở góc trên bên trái
3. Chọn file `postman_collection.json`
4. Collection "MCD Backend API" sẽ xuất hiện

### 2. Import Environment
1. Click vào **Environments** ở sidebar bên trái
2. Click **Import**
3. Chọn file `postman_environment.json`
4. Environment "MCD Backend - Local" sẽ xuất hiện
5. Chọn environment này để sử dụng

## Cấu hình Environment

Sau khi import, bạn có thể chỉnh sửa các biến trong environment:

- `base_url`: URL của backend (mặc định: `http://localhost:3000`)
- `access_token`: Token JWT (sẽ tự động được lưu sau khi login)
- `user_id`, `branch_id`, `faculty_id`, etc.: Các ID để test

## Sử dụng Collection

### Bước 1: Đăng ký hoặc Đăng nhập

1. Mở folder **Auth**
2. Chạy request **Register** hoặc **Login**
3. Token sẽ tự động được lưu vào biến `access_token` thông qua Test Script

### Bước 2: Sử dụng các API khác

Sau khi có token, tất cả các request khác sẽ tự động sử dụng token này trong header `Authorization: Bearer {{access_token}}`

## Cấu trúc Collection

Collection được tổ chức theo các module:

1. **Auth**: Đăng ký, đăng nhập
2. **Users**: Quản lý users (ADMIN only)
3. **Branches**: Quản lý chi nhánh
4. **Faculties**: Quản lý khoa
5. **Subjects**: Quản lý môn học
6. **Online Classes**: Quản lý lớp học
7. **Class Members**: Join/Leave lớp
8. **Lessons**: Quản lý bài học
9. **File Resources**: Upload và quản lý file
10. **Posts**: Quản lý bài đăng
11. **Comments**: Quản lý bình luận
12. **Reactions**: Like/Reaction bài đăng
13. **Teacher Calendar**: Quản lý lịch giáo viên

## Lưu ý

- Tất cả các API (trừ Auth) đều yêu cầu JWT token
- Một số API chỉ dành cho ADMIN hoặc TEACHER
- Các biến như `:id`, `:classId` có thể được chỉnh sửa trực tiếp trong URL hoặc thông qua environment variables
- Query parameters có thể được bật/tắt trong Postman

## Test Script

Collection đã được cấu hình Test Script để tự động lưu `access_token` sau khi login/register thành công. Bạn không cần phải copy token thủ công.

## Troubleshooting

### Token không được lưu tự động
- Kiểm tra xem response có trả về `accessToken` không
- Kiểm tra Test Script trong request Login/Register
- Thử chạy lại request Login/Register

### 401 Unauthorized
- Kiểm tra xem token có được set trong environment không
- Thử login lại để lấy token mới
- Kiểm tra xem token đã hết hạn chưa

### 403 Forbidden
- Kiểm tra xem user có đủ quyền (role) để thực hiện action này không
- ADMIN có toàn quyền
- TEACHER chỉ có quyền quản lý lớp của mình
- USER chỉ có quyền xem và tương tác

