import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;
      return user;
      // TODO: Return JWT

    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    })

    if( !user )
      throw new UnauthorizedException('Credentials are not valid (email)');
      
    if( !bcrypt.compareSync(password, user.password) )
      throw new UnauthorizedException('Credentials are not valid (password)');

    return user;
    // TODO: Return JWT
  }


  private handleDbErrors( error: any ): never {
    switch( error.code ) {
      case '23505':
        throw new BadRequestException(error.detail);
    
      default:
        console.log(error);
        throw new InternalServerErrorException('Please check server logs for more details');
    }
  }
}
