import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {

    @ApiProperty({
        description: 'Product Title',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'Product Sizes',
        type: [String]
    })
    @IsString({  each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        description: 'Product Gender',
        enum: ['men', 'women', 'kid', 'unisex']
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        description: 'Product description',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
    
    @ApiProperty({
        description: 'Product price',
        required: false,
        minimum: 0,
        default: 0
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty( {
        description: 'Product slug (for SEO)',
        required: false,
        default: '<The product title>'
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'Amount of the product',
        default: 0,
        minimum: 0,
        required: false
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'Product tags and categories',
        type: [String],
        minItems: 1
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags: string[];

    @ApiProperty({
        description: 'Product images',
        type: [String],
        minItems: 1,
        required: false,
        nullable: true
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];
}
