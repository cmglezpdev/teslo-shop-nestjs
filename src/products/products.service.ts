import { Logger, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {
  
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ){}

  async create(createProductDto: CreateProductDto) {
   try {

      const { images = [], ...productDetails } = createProductDto;
      const product = this.productsRepository.create({
        ...productDetails,
        images: images.map( image => this.productImageRepository.create({ url: image }) )
      });

      await this.productsRepository.save(product);

      return { ...product, images };

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
      // TODO: crear una busqueda mas completa con leventein
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const product = await this.productsRepository.preload({
      id,
      ...updateProductDto,
      images: [],
    })
    
    if( !product )
      throw new BadRequestException(`Product with id ${id} not found`);

    try {
      return await this.productsRepository.save(product);      
    } catch (error) {
      this.handleDBException(error);
    }
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
