import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';


@Entity({ name: 'product_images' })
export class ProductImage {
    @ApiProperty({
        description: 'Product Image Id',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn()
    id: string;

    @ApiProperty({
        description: 'Product Image Url',
    })
    @Column('text')
    url: string;

    @ApiProperty({
        description: 'Product that use this image',
        type: Product
    })
    @ManyToOne(
        () => Product,
        product => product.images,
        { onDelete: 'CASCADE' }
    )
    product: Product;
}