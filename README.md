<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Hệ thống quản lý lớp học online với NestJS, TypeORM và SQLite.

### Tính năng chính:

- **Xác thực JWT**: Đăng ký, đăng nhập với JWT token
- **Phân quyền 3 role**: ADMIN, TEACHER, USER
- **Quản lý chi nhánh**: Quản lý các chi nhánh (Branch)
- **Quản lý khoa & môn học**: Quản lý Faculty và Subject
- **Quản lý lớp học**: Tạo và quản lý OnlineClass
- **Quản lý bài học**: Tạo Lesson cho từng lớp
- **Tương tác**: Post, Comment, Reaction
- **Quản lý file**: Upload và quản lý FileResource
- **Lịch giáo viên**: TeacherCalendar để quản lý lịch dạy

### Cấu trúc dự án:

```
src/
├── auth/              # Module xác thực JWT
├── user/              # Module quản lý user
├── branch/             # Module quản lý chi nhánh
├── faculty/            # Module quản lý khoa
├── subject/            # Module quản lý môn học
├── online-class/       # Module quản lý lớp học
├── class-member/       # Module quản lý thành viên lớp
├── lesson/             # Module quản lý bài học
├── file-resource/      # Module quản lý file
├── post/               # Module quản lý bài đăng
├── comment/            # Module quản lý bình luận
├── reaction/           # Module quản lý reaction
├── teacher-calendar/   # Module quản lý lịch giáo viên
├── entities/           # TypeORM entities
├── common/             # Guards, Interceptors, Filters, DTOs
└── config/             # Cấu hình database
```

### Guards:

- `JwtAuthGuard`: Xác thực JWT token
- `RolesGuard`: Kiểm tra quyền theo role
- `BranchGuard`: Kiểm tra quyền truy cập theo branch

### Interceptors:

- `TransformResponseInterceptor`: Chuẩn hóa format response
- `PaginationInterceptor`: Hỗ trợ pagination

### Filters:

- `AllExceptionsFilter`: Global exception filter

## Project setup

```bash
# Cài đặt dependencies
$ npm install

# Tạo file .env từ .env.example
$ cp .env.example .env

# Chỉnh sửa JWT_SECRET trong file .env
```

### Cấu hình môi trường:

Tạo file `.env` với nội dung:

```
JWT_SECRET=your-secret-key-change-this-in-production
PORT=3000
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode (khuyến nghị cho development)
$ npm run start:dev

# production mode
$ npm run start:prod
```

Server sẽ chạy tại: `http://localhost:3000`
API prefix: `/api`

### API Endpoints chính:

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/users` - Danh sách users (ADMIN only)
- `GET /api/branches` - Danh sách chi nhánh
- `GET /api/faculties` - Danh sách khoa
- `GET /api/subjects` - Danh sách môn học
- `GET /api/online-classes` - Danh sách lớp học
- `POST /api/class-members/join/:classId` - Join lớp học
- Và nhiều endpoints khác...

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
