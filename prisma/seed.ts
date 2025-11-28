import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...');

  // Tạo Branch "Chi Nhánh Hà Nội"
  const branch = await prisma.branch.upsert({
    where: { code: 'HN' },
    update: {},
    create: {
      name: 'Chi Nhánh Hà Nội',
      code: 'HN',
      address: 'Hà Nội, Việt Nam',
      description: 'Chi nhánh chính tại Hà Nội',
    },
  });

  console.log('✅ Đã tạo Branch:', branch.name);

  // Hash password mặc định cho admin
  const passwordHash = await bcrypt.hash('123123', 10);

  // Tạo User Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      branchId: branch.id,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@example.com',
      passwordHash,
      fullName: 'Administrator',
      role: 'ADMIN',
      branchId: branch.id,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Đã tạo User Admin:', adminUser.email);
  console.log('📧 Email: admin@example.com');
  console.log('🔑 Password: admin123');
  console.log('🏢 Branch: Chi Nhánh Hà Nội');

  console.log('✨ Seed dữ liệu hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

