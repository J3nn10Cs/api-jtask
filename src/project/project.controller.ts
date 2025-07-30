import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserDocument } from 'src/auth/entities/user-auth.entity';

@Auth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Auth()
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user : UserDocument
  ) {
    return this.projectService.createProject(createProjectDto, user);
  }

  @Get()
  @Auth()
  findAll(
    @GetUser() user : UserDocument
  ) {
    return this.projectService.findAll(user);
  }

  @Get(':id')
  @Auth()
  findOne(
    @Param('id') id: string,
    @GetUser() user: UserDocument
  ) {
    return this.projectService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: UserDocument
  ) {
    return this.projectService.update(id, updateProjectDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser() user: UserDocument
  ) {
    return this.projectService.remove(id);
  }
}
