import { Module } from '@nestjs/common';
import { FileResourceService } from './file-resource.service';
import { FileResourceController } from './file-resource.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FileResourceController],
  providers: [FileResourceService],
  exports: [FileResourceService],
})
export class FileResourceModule {}

