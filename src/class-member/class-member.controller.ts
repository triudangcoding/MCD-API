import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClassMemberService } from './class-member.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('class-members')
@UseGuards(JwtAuthGuard)
export class ClassMemberController {
  constructor(private readonly classMemberService: ClassMemberService) {}

  @Post('join/:classId')
  joinClass(@CurrentUser() user: any, @Param('classId') classId: string) {
    return this.classMemberService.joinClass(user.id, classId);
  }

  @Get('my-classes')
  getMyClasses(@CurrentUser() user: any) {
    return this.classMemberService.getMyClasses(user.id);
  }

  @Delete('leave/:classId')
  leaveClass(@CurrentUser() user: any, @Param('classId') classId: string) {
    return this.classMemberService.leaveClass(user.id, classId);
  }
}

