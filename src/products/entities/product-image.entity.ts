import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: string;

    @Column('text')
    url: string;
}