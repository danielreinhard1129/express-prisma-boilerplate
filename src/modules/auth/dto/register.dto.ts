import { IsNotEmpty, IsString } from "class-validator";

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  readonly email!: string;

  @IsNotEmpty()
  @IsString()
  readonly password!: string;
}
