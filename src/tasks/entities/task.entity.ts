import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Projects } from "src/project/entities/project.entity";

const taskStatus = {
  PENDING : 'pending',
  ON_HOLD : 'onHold',
  IN_PROGRESS : 'inProgress',
  UNDER_REVIEW : 'underReview',
  COMPLETED : 'completed'
} as const

export type TaskDocument = HydratedDocument<Tasks>;

@Schema({ timestamps: true })
export class Tasks {
  @Prop({
    required: true,
    trim: true
  })
  name: string;

  @Prop({
    required: true,
    trim: true
  })
  description: string;

  // User assigned to the task
  @Prop({
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Projects',
  })
  project: Projects;

  @Prop({
    enum : Object.values(taskStatus),
    default: taskStatus.PENDING,
  })
  status: string; 
}

export const TaskSchema = SchemaFactory.createForClass(Tasks);