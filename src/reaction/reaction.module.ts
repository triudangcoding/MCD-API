import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReactionController],
  providers: [ReactionService],
  exports: [ReactionService],
})
export class ReactionModule {}

