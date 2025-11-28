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
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('faculties')
@UseGuards(JwtAuthGuard)
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultyService.create(createFacultyDto);
  }

  @Get()
  findAll(@Query('branchId') branchId?: string) {
    return this.facultyService.findAll(branchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facultyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateFacultyDto: UpdateFacultyDto) {
    return this.facultyService.update(id, updateFacultyDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.facultyService.remove(id);
  }
}

