import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OnlineClassService } from './online-class.service';
import { CreateOnlineClassDto } from './dto/create-online-class.dto';
import { UpdateOnlineClassDto } from './dto/update-online-class.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('online-classes')
@UseGuards(JwtAuthGuard)
export class OnlineClassController {
  constructor(private readonly onlineClassService: OnlineClassService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  create(@Body() createOnlineClassDto: CreateOnlineClassDto) {
    return this.onlineClassService.create(createOnlineClassDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('branchId') branchId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('status') status?: string,
  ) {
    return this.onlineClassService.findAll(paginationDto, {
      branchId,
      teacherId,
      subjectId,
      status,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.onlineClassService.findOne(id);
  }

  @Get(':id/members')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  getMembers(@Param('id') id: string) {
    return this.onlineClassService.getMembers(id);
  }

  @Patch(':id/members/:memberId/approve')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  approveMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.onlineClassService.approveMember(id, memberId);
  }

  @Patch(':id/members/:memberId/reject')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  rejectMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.onlineClassService.rejectMember(id, memberId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  update(@Param('id') id: string, @Body() updateOnlineClassDto: UpdateOnlineClassDto) {
    return this.onlineClassService.update(id, updateOnlineClassDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.onlineClassService.remove(id);
  }
}

