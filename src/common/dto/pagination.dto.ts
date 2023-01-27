import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';


export class PaginationDto {

    @ApiProperty({
        description: 'How many rows do you need?',
        required: false, 
        default: 10,
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;
    
    @ApiProperty({
        description: 'How many rows do you want skip?',
        required: false,
        default: 0,
    })
    @IsOptional()
    @Min(0)   
    @Type(() => Number)
    offset?: number;
}