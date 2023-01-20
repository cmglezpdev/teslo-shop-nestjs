import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';


@Entity({ name: 'product_images' })
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: string;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Product,
        product => product.images,
        { onDelete: 'CASCADE' }
    )
    product: Product;
}