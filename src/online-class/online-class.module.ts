import { Module } from '@nestjs/common';
import { OnlineClassService } from './online-class.service';
import { OnlineClassController } from './online-class.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OnlineClassController],
  providers: [OnlineClassService],
  exports: [OnlineClassService],
})
export class OnlineClassModule {}

