import { Transform, Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";


export class PaginationDto {
 
    @IsOptional()
    @IsPositive() 
    @Type( () => Number) 
    limit?: number = 1;
 
    @IsOptional()
    @IsPositive() 
    @Type( () => Number)
    page?: number = 10;

}