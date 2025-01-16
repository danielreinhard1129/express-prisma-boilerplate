import { IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  readonly email!: string;

  @IsNotEmpty()
  @IsString()
  readonly password!: string;
}
