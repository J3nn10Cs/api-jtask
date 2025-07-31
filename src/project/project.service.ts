import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectDocument, Projects } from './entities/project.entity';
import { UserDocument } from 'src/auth/entities/user-auth.entity';

@Injectable()
export class ProjectService {

  constructor(
    @InjectModel(Projects.name)
    private projectModel : Model<ProjectDocument>,
  ){}

  async createProject(
    createProjectDto: CreateProjectDto,
    user : UserDocument
  ) {

    try {
      const createdProject = new this.projectModel(createProjectDto);
  
      createdProject.manager = user.id;
  
      await createdProject.save();
  
      return 'Proyecto creado correctamente'
    } catch (error) {
      throw new Error(`Error creating project: ${error.message}`); 
    }
  }

  async findAll(user: UserDocument) {
    try {
      const projects = await this.projectModel.find({
        $or : [
          { manager : { $in : user.id } }
        ]
      })

      return projects;
    } catch (error) {
      throw new Error(`Error finding projects: ${error.message}`);
    }
  }

  async findOne(
    id: string,
    user: UserDocument
  ) {

    try {
      const project = await this.projectModel.findById(id).populate('tasks');
  
      if (!project) {
        throw new Error(`Project with id ${id} not found`);
      }

      if (project.manager.toString() !== user.id) {
        throw new Error(`You are not authorized to access this project`);
      }

      return project;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: UserDocument
  ) {
    try {
      const project = await this.findOne(id, user);

      if (updateProjectDto.projectName)
        updateProjectDto.projectName = updateProjectDto.projectName.toLowerCase();

      if (updateProjectDto.description)
        updateProjectDto.description = updateProjectDto.description.toLowerCase();

      await this.projectModel.findByIdAndUpdate(
        { _id : project._id },
        updateProjectDto,
        { new: true }
      )

      return 'Proyecto actualizado correctamente';

    } catch (error) {
      throw error
    }
  }

  async remove(
    user : UserDocument,
    id: string
  ) {
    try {
      const project = await this.projectModel.findById(id);
      if(!project) throw new BadRequestException('El proyecto no existe');
      if(project.manager.toString() !== user.id.toString()) throw new BadRequestException('Solo el dueño del proyecto puede eliminarlo');

      await this.projectModel.deleteOne();

      return 'Proyecto eliminado correctamente';

    } catch (error) {
      throw error
      
    }
  }
}
