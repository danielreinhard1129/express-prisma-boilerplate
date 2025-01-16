import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { SortOrder } from "../types";

export class PaginationQueryParams {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly take: number = 5;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly page: number = 1;

  @IsOptional()
  @IsString()
  readonly sortBy: string = "createdAt";

  @IsOptional()
  @IsEnum(SortOrder)
  readonly sortOrder: SortOrder = SortOrder.DESC;

  @Transform(({ value }) => value === "true")
  @IsOptional()
  readonly all: boolean = false;
}
