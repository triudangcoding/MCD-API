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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('role') role?: Role,
    @Query('branchId') branchId?: string,
    @Query('status') status?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.userService.findAll(paginationDto, {
      role,
      branchId,
      status,
      keyword,
    });
  }

  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getStatistics(@Query('branchId') branchId?: string) {
    return this.userService.getStatisticsByBranch(branchId);
  }

  @Get('branch/:branchId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getUsersByBranch(
    @Param('branchId') branchId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.userService.getUsersByBranch(branchId, paginationDto);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.userService.findOne(user.id);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/toggle-status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  toggleStatus(@Param('id') id: string) {
    return this.userService.toggleStatus(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.userService.updateStatus(id, body.status);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

