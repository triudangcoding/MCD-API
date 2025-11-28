import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('branches')
@UseGuards(JwtAuthGuard)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.branchService.findAll();
  }

  @Get('my-branch')
  getMyBranch(@CurrentUser() user: any) {
    // USER có thể xem branch của mình
    if (!user.branchId) {
      return null;
    }
    return this.branchService.findOne(user.branchId);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.branchService.remove(id);
  }
}

