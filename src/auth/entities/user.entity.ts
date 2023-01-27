import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

@Entity('users')
export class User {

    @ApiProperty({
        description: 'User Id',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'User email',
        uniqueItems: true,
    })
    @Column('text', { unique: true })
    email: string;
    
    @ApiProperty({
        description: 'User password',
    })
    @Column('text', { select: false })
    password: string;

    @ApiProperty({
        description: 'User full name',
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        description: 'If the user is active or not',
        type: Boolean,
    })
    @Column('bool', { default: true })
    isActive: boolean;

    @ApiProperty({
        description: 'User roles (admin, user, etc.)',
        type: [String],
    })
    @Column('text', { array: true, default: ['user'] })
    roles: string[];

    @ApiProperty({
        description: 'Product that the user created',
        type: () => Product,
    })
    @OneToMany(
        () => Product,
        (product) => product.user 
    )
    product: Product;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
