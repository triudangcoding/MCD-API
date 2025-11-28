# Hướng dẫn Migrate từ TypeORM sang Prisma

## Đã hoàn thành ✅

1. ✅ Cài đặt Prisma và Prisma Client
2. ✅ Tạo Prisma schema với SQLite
3. ✅ Tạo PrismaService và PrismaModule (Global)
4. ✅ Tạo SharedModule
5. ✅ Migrate Auth module
6. ✅ Migrate User module
7. ✅ Cập nhật app.module.ts
8. ✅ Chạy migration database

## Cần migrate các modules còn lại

Các modules sau vẫn đang dùng TypeORM và cần được migrate:

- [ ] Branch Module
- [ ] Faculty Module
- [ ] Subject Module
- [ ] OnlineClass Module
- [ ] ClassMember Module
- [ ] Lesson Module
- [ ] FileResource Module
- [ ] Post Module
- [ ] Comment Module
- [ ] Reaction Module
- [ ] TeacherCalendar Module

## Cách migrate một module

### Bước 1: Cập nhật Service

Thay đổi từ:
```typescript
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entity } from '../entities/entity.entity';

@Injectable()
export class Service {
  constructor(
    @InjectRepository(Entity)
    private repository: Repository<Entity>,
  ) {}
}
```

Thành:
```typescript
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class Service {
  constructor(private prisma: PrismaService) {}
}
```

### Bước 2: Cập nhật các methods

**TypeORM → Prisma:**

- `findOne({ where: { id } })` → `findUnique({ where: { id } })`
- `find({ where, relations: [...] })` → `findMany({ where, include: {...} })`
- `findAndCount({ where })` → `Promise.all([findMany(...), count(...)])`
- `create({ data })` → `create({ data })`
- `save(entity)` → `create({ data })` hoặc `update({ where, data })`
- `update(id, data)` → `update({ where: { id }, data })`
- `remove(entity)` → `delete({ where: { id } })`
- `Like('%keyword%')` → `{ contains: 'keyword' }`

### Bước 3: Cập nhật Module

Thay đổi từ:
```typescript
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entity } from '../entities/entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  ...
})
```

Thành:
```typescript
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  ...
})
```

## Ví dụ: Migrate Branch Module

### BranchService (trước)
```typescript
async findAll() {
  return this.branchRepository.find();
}
```

### BranchService (sau)
```typescript
async findAll() {
  return this.prisma.branch.findMany();
}
```

### BranchService với relations
```typescript
async findOne(id: number) {
  return this.prisma.branch.findUnique({
    where: { id },
    include: {
      users: true,
      faculties: true,
      classes: true,
    },
  });
}
```

## Lưu ý

1. Prisma sử dụng `include` thay vì `relations`
2. Prisma sử dụng `findUnique` cho unique fields, `findFirst` cho non-unique
3. Prisma không có `Like`, dùng `contains`, `startsWith`, `endsWith`
4. Prisma enum phải match với schema
5. Xóa tất cả imports từ `@nestjs/typeorm` và `typeorm`

## Sau khi migrate xong

1. Xóa folder `src/entities/`
2. Xóa dependencies TypeORM khỏi `package.json`:
   - `@nestjs/typeorm`
   - `typeorm`
   - `sqlite3` (nếu không dùng nữa)
3. Chạy `npm install` để cập nhật dependencies
4. Test lại tất cả API endpoints

