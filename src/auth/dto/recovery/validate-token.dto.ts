import { IsNotEmpty } from "class-validator";

export class ValidateTokenAuthDto {
  
  @IsNotEmpty()
  public token: string;
}