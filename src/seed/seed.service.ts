import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    private readonly authService: AuthService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async runSeed() {
    await this.deleteTables();
    const admin = await this.insertNewUsers();
    await this.insertNewProducts(admin);
    return 'SEED EXECURED';
  }
  
  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertNewUsers() {
    const seedUsers = initialData.users;
    const insertPromises = []
    seedUsers.forEach(user => {
      insertPromises.push( this.authService.create(user) );
    })
    const [admin, ] = await Promise.all( insertPromises )
    return admin;
  }
 

  private async insertNewProducts( user: User ) {
    await this.productsService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];
    products.forEach( product => {
      insertPromises.push( this.productsService.create( product, user ) );
    })

    await Promise.all( insertPromises );
    return true;
  }

}
