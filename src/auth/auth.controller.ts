import { IncomingHttpHeaders } from 'http';
import { Controller, Post, Body, Get, UseGuards, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { GetUser, RawHeaders, RoleProtected } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: User,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: "Hello World Private",
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user )
  // @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

    @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

  

}
