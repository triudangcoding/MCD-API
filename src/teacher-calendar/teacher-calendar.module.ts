import { Module } from '@nestjs/common';
import { TeacherCalendarService } from './teacher-calendar.service';
import { TeacherCalendarController } from './teacher-calendar.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TeacherCalendarController],
  providers: [TeacherCalendarService],
  exports: [TeacherCalendarService],
})
export class TeacherCalendarModule {}

