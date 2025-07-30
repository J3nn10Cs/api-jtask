import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop({
    required: true, 
    trim: true,
    lowercase: true,
    unique: true
  })
  email: string

  @Prop({
    required: true,
    trim: true
  })
  password: string;

  @Prop({
    trim: true,
    required: true
  })
  name: string;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    default : false
  })
  confirmed: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);