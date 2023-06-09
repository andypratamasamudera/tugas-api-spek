import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUsersDto } from './dto/login-users.dto';
import { RegisterUsersDto } from './dto/register-users.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth/register')
  Register(@Body() registerUsersDto: RegisterUsersDto): Promise<{ token : string }> {
    return this.usersService.Register(registerUsersDto);
  }

  @Post('/auth/login')
  Login(@Body() loginUsersDto: LoginUsersDto): Promise<{ token : string }> {
    return this.usersService.Login(loginUsersDto);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfike(@Request() req){
    return req.User
  }
}
