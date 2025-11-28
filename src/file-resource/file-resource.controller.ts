import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileResourceService } from './file-resource.service';
import { CreateFileResourceDto } from './dto/create-file-resource.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('file-resources')
@UseGuards(JwtAuthGuard)
export class FileResourceController {
  constructor(private readonly fileResourceService: FileResourceService) {}

  @Post()
  create(
    @Body() createFileResourceDto: CreateFileResourceDto,
    @CurrentUser() user: any,
  ) {
    return this.fileResourceService.create(createFileResourceDto, user.id);
  }

  @Get()
  findAll(
    @Query('onlineClassId') onlineClassId?: string,
    @Query('lessonId') lessonId?: string,
    @Query('uploaderId') uploaderId?: string,
  ) {
    return this.fileResourceService.findAll({
      onlineClassId,
      lessonId,
      uploaderId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileResourceService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.fileResourceService.remove(id, user.id);
  }
}

