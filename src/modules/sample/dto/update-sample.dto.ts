import { IsOptional, IsString } from "class-validator";

export class UpdateSampleDTO {
  @IsOptional()
  @IsString()
  readonly name?: string;
}
