import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './entities/users.schema';
import { Model } from 'mongoose';
import { RegisterUsersDto } from './dto/register-users.dto';
import { LoginUsersDto } from './dto/login-users.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private UsersModel : Model<Users>,
    private jwtService : JwtService
  ){}

  async Register( registerUsersDto: RegisterUsersDto): Promise<{ token : string }> {
    const { username, email, password } = registerUsersDto;
    const BcryptPassword = await bcrypt.hash(password, 10);
    const CheckDupEmail = await this.UsersModel.findOne({ email });
    if(!CheckDupEmail){
      const users = await this.UsersModel.create({ username, email, password: BcryptPassword});
      const token = this.jwtService.sign({ id: users._id});
      return {token} 
    }else{
      throw new UnauthorizedException('Email Telah Terdaftar')
    }

  }

  async Login(loginUsersDto: LoginUsersDto): Promise<{ token : string }> {
    const { email, password } = loginUsersDto;
    const User = await this.UsersModel.findOne({ email });
    if(!User){
      throw new UnauthorizedException('Email Belum Terdaftar');
    }
    const ComparePass = await bcrypt.compare(password, User.password)
    if(!ComparePass){
      throw new UnauthorizedException('Password Salah');
    }
    const token = this.jwtService.sign({ id: User._id });
    return { token };
  }
}
