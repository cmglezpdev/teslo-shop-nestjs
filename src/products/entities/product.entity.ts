import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { User } from "src/auth/entities/user.entity";
import { ProductImage } from "./product-image.entity";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        description: 'Product Id',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ApiProperty({
        description: 'Product Title',
        uniqueItems: true,
    })
    @Column('text', { unique: true })
    title: string;

    @ApiProperty({
        description: 'Product Price',
    })
    @Column('float', { default: 0 })
    price: number;

    @ApiProperty({
        description: 'Product Description',
        default: null
    })
    @Column('text', { nullable: true })
    description: string;

    @ApiProperty({
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    slug: string;

    @ApiProperty({
        description: 'Product Stock',
        default: 0	
    })
    @Column('int', { default: 0 })
    stock: number;

    @ApiProperty({
        description: 'Product Sizes',
    })
    @Column('text', { array: true })
    sizes: string[];

    @ApiProperty({
        description: 'Product gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        description: 'Product Tags',
        default: []
    })
    @Column('text', { array: true, default: [] })
    tags: string[];

    @ApiProperty({
        description: 'Product Images',
        required: false,
        type: [ProductImage]
    })
    @OneToMany(
        () => ProductImage, 
        productImage => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ApiProperty({
        description: 'User that created this product',
        uniqueItems: true,
        type: User
    })
    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User;
    

    @BeforeInsert()
    checkSlugIsert() {
        if( !this.slug ) {
            this.slug = this.title 
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", "")   
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", "")   
    }
}
