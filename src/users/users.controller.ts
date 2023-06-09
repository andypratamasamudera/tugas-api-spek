import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUsersDto } from './dto/login-users.dto';
import { RegisterUsersDto } from './dto/register-users.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth/register')
  register(@Body() registerUsersDto: RegisterUsersDto): Promise<{ token : string}> {
    return this.usersService.Register(registerUsersDto);
  }

  @Post('/auth/login')
  login(@Body() loginUsersDto: LoginUsersDto): Promise<{ token : string}> {
    return this.usersService.Login(loginUsersDto);
  }
}