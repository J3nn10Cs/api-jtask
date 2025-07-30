
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type TokenDocument = HydratedDocument<Tokens>;

@Schema()
export class Tokens {
  @Prop({
    required: true,
    unique: true,
  })
  token : string;

  @Prop({
    type : Types.ObjectId,
    ref: 'Users'
  })
  user : string

  @Prop({
    default : Date.now()
  })
  expiresAt : Date;
}

export const TokenSchema = SchemaFactory.createForClass(Tokens);