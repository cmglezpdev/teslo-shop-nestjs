import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  // @Auth(ValidRoles.superUser, ValidRoles.admin)
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  @ApiCreatedResponse({ description: 'Product was created', type: Product})
  @ApiBadRequestResponse({ description: 'Bad Request'})
  @ApiForbiddenResponse({ description: 'Forbinden. Token related'})
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User  
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @ApiOkResponse({ description: 'All products with pagination', type: [Product] })
  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.productsService.findAll( paginationDto );
  }

  @ApiOkResponse({ description: 'Product found', type: Product })
  @ApiBadRequestResponse({ description: 'Product not found' })
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @ApiOkResponse({ description: 'Product updated', type: Product })
  @ApiBadRequestResponse({ description: 'Product not found' })
  @ApiForbiddenResponse({ description: 'Forbinden. Token related'})
  @Patch(':id')
  // @Auth(ValidRoles.superUser, ValidRoles.admin)
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @ApiOkResponse({ description: 'Product deleted', type: Product })
  @ApiBadRequestResponse({ description: 'Product not found' })
  @ApiForbiddenResponse({ description: 'Forbinden. Token related'})
  @Delete(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
