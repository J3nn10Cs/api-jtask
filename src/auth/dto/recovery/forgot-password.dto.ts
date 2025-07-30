import { IsEmail } from "class-validator";

export class ForgotPasswordAuthDto {

  @IsEmail()
  public email: string;
}