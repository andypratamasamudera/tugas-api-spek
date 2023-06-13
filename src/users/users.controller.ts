import { Controller, Get, Post, Body, Patch, Param, Delete , UnauthorizedException, Request, UseGuards} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUsersDto } from './dto/login-users.dto';
import { RegisterUsersDto } from './dto/register-users.dto';
import { AuthGuard } from './entities/auth.guard';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth/register')
  register(@Body() registerUsersDto: RegisterUsersDto): Promise<{token: { AccessToken: string, RefreshToken: string }, user: { email: string, name: string } }> {
    return this.usersService.Register(registerUsersDto);
  }

  @Post('/auth/login')
  login(@Body() loginUsersDto: LoginUsersDto): Promise<{token: { AccessToken: string, RefreshToken: string }, user: { email: string, name: string } }> {
    return this.usersService.Login(loginUsersDto);
  }

  @Get('/auth/user')
  @UseGuards(AuthGuard)
  async getDataByToken(@Request() req): Promise<any>{
    if(req.user && req.user?.id) {
      const user = await this.usersService.getDataByToken(req.user.id);
      return {
        name: user.username,
        email: user.email,
      };
    }else{
      throw new UnauthorizedException('Invalid Token')
    }
  }
}