import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        example: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Product Sizes',
        type: [String]
    })
    @IsString({  each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        example: 'men',
        description: 'Product Gender',
        enum: ['men', 'women', 'kid', 'unisex']
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
        description: 'Product description',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
    
    @ApiProperty({
        example: 305.99,
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
        example: 't_shirt_teslo',
        description: 'Product slug (for SEO)',
        required: false,
        default: '<The product title>'
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        example: 5,
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
        example: ['t-shirt', 'clothes', 'clothing'],
        description: 'Product tags and categories',
        type: [String],
        minItems: 1
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags: string[];

    @ApiProperty({
        example: ['t-shirt-teslo.jpg', 't-shirt-teslo-2.jpg'],
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
