import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from 'config/envs';
import { UserAuthModule } from './auth/user-auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ProjectModule,
    MongooseModule.forRoot(envs.databaseurl),
    UserAuthModule,
    TasksModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
