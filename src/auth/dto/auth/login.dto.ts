import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginAuthDto {
  
  @IsEmail()
  public email : string;

  @IsNotEmpty({
    message: 'Password is required for login'
  })
  public password : string;
}