import { IsNumber, IsString, MinLength } from "class-validator";
// import { Match } from "src/common/validator/match.decorator";

export class ChangePasswordAuthDto {

  @IsNumber()
  public token: number;

  @IsString()
  @MinLength(8)
  public password: string;

  // @IsString()
  // @MinLength(8)
  // @Match('password', {
  //   message: 'The password and confirmation do not match',
  // })
  public password_confirmation: string;

}