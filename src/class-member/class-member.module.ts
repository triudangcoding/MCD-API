import { Module } from '@nestjs/common';
import { ClassMemberService } from './class-member.service';
import { ClassMemberController } from './class-member.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClassMemberController],
  providers: [ClassMemberService],
  exports: [ClassMemberService],
})
export class ClassMemberModule {}

