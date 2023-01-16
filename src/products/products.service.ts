import { Logger, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ){}

  async create(createProductDto: CreateProductDto) {
   try {

      const product = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(product);

      return product;

   } catch (error) {
    this.handleDBException(error);
   } 
  }

  findAll( paginationDto: PaginationDto ) {

    const{ limit = 10, offset = 0 } = paginationDto;
    return this.productsRepository.find({
      take: limit,
      skip: offset,
      // TODO: Relaciones
    })
  }

  async findOne(term: string) {

    let product: Product;
    if( isUUID(term) ) {
      product = await this.productsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase()
        }).getOne();
    }
    
    if( !product )
      throw new BadRequestException(`Product with term ${term} not found`);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return await this.productsRepository.remove(product);
  }

  private handleDBException(error: any) {
    this.logger.error(error);  
    if( error.code === '23505' )
      throw new BadRequestException(error.detail);
    throw new InternalServerErrorException("Unexpected error, check server logs");
  }
}
