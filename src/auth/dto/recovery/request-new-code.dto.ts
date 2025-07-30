import { IsEmail } from "class-validator";

export class RequestNewCodeAuthDto {

  @IsEmail()
  public email : string;
}