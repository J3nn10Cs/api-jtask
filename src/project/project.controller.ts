import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserDocument } from 'src/auth/entities/user-auth.entity';
import { Auth, GetUser } from 'src/auth/decorators';

Auth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user : UserDocument
  ) {
    return this.projectService.createProject(createProjectDto, user);
  }

  @Get()
  findAll(
    @GetUser() user : UserDocument
  ) {
    return this.projectService.findAll(user);
  }

  @Get(':id')
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
    return this.projectService.remove(user,id);
  }
}
