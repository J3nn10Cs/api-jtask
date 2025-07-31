import { IsString, MinLength } from "class-validator";
import { Match } from "src/auth/decorators";

export class ChangePasswordAuthDto {
  @IsString()
  @MinLength(8)
  public password: string;

  @IsString()
  @MinLength(8)
  @Match('password', {
    message: 'The password and confirmation do not match',
  })
  public password_confirmation: string;

}