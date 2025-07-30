import { IsNotEmpty } from "class-validator";

export class ConfirmUserAuthDto {
  @IsNotEmpty({
    message: 'Token is required for confirmation'
  })
  public token : string;
}