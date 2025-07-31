import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Match } from "src/auth/decorators";

export class CreateUserAuthDto {
  @IsString()
  @IsNotEmpty()
  public name : string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email : string;
  
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  public password : string;

  @IsNotEmpty()
  @IsString()
  @Match('password', {
    message: 'The password and confirmation do not match',
  })
  public password_confirmation : string;

}
