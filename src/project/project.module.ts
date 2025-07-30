import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Projects, ProjectSchema } from './entities/project.entity';
import { UserAuthModule } from 'src/auth/user-auth.module';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name : Projects.name,
      schema : ProjectSchema,
    }
  ]), UserAuthModule ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
