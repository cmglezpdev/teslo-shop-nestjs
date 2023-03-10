import { IncomingHttpHeaders } from 'http';
import { Controller, Post, Body, Get, UseGuards, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiTags, ApiBadRequestResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'User created successfully', type: User })
  @ApiBadRequestResponse({ description: 'Error with the database.' })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiOkResponse({ description: 'User logged in successfully', type: User })
  @ApiUnauthorizedResponse({ description: 'Credentials are not valids(email/password)' })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiOkResponse({ description: 'Status token Checked and revalidated', type: String })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. Please login.', type: String })
  @Get('check-status')
  @Auth()
  checkStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }

  @ApiOkResponse({ description: 'Private endpoint to practice to create decorators', type: User })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // endpoint to get information of the request(practice)
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

  @ApiOkResponse({ description: 'Private endpoint to practice to create guards', type: User })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // endpoint to controler the access thought the authorization and roles(practice)
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

  @ApiOkResponse({ description: 'Private endpoint to practice to create an auth decorator', type: User })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // endpoint to do decorators composition(practice)
  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

  

}
