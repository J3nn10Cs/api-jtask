import { 
  Prop, 
  Schema, 
  SchemaFactory 
} from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Users } from "src/auth/entities/user-auth.entity";
import { Tasks } from "src/tasks/entities/task.entity";

export type ProjectDocument = HydratedDocument<Projects>;

@Schema({ timestamps: true })
export class Projects {
  @Prop({
    required: true, 
    trim: true
  })
  projectName : string;

  @Prop({
    required: true, 
    trim: true
  })
  clientName : string;

  @Prop({
    required: true,
    trim: true
  })
  description : string;

  @Prop({
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Tasks'
  })
  tasks : Tasks[]

  //User created the project
  @Prop({
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  })
  manager : Users

  //Team members assigned to the project
  @Prop({
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  })
  team : Users[]
}

export const ProjectSchema = SchemaFactory.createForClass(Projects);
