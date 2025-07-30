import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {

  @IsString()
  @IsNotEmpty()
  public projectName : string

  @IsString()
  @IsNotEmpty()
  public clientName : string

  @IsString()
  @IsNotEmpty()
  public description : string
}
