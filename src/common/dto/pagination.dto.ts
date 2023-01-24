import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';


export class PaginationDto {

    @ApiProperty({
        required: false, default: 10, description: 'How many rows do you need?'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;
    
    @ApiProperty({
        required: false, default: 0, description: 'How many rows do you want skip?'
    })
    @IsOptional()
    @Min(0)   
    @Type(() => Number)
    offset?: number;
}