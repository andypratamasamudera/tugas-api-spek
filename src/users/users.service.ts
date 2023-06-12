import { Injectable, NotFoundException, UnauthorizedException, Res, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './entities/users.schema';
import { Model } from 'mongoose';
import { RegisterUsersDto } from './dto/register-users.dto';
import { LoginUsersDto } from './dto/login-users.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { request } from 'http';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private UsersModel : Model<Users>,
    private jwtService : JwtService
  ){}

  async Register(registerUsersDto: RegisterUsersDto): Promise<{token: { AccessToken: string, RefreshToken: string }, user: { email: string, name: string } }> {
    const { username, email, password } = registerUsersDto;
    const BcryptPassword = await bcrypt.hash(password, 10);
    const CheckDupEmail = await this.UsersModel.findOne({ email });
    if(!CheckDupEmail){
      const users = await this.UsersModel.create({ username, email, password: BcryptPassword});
      // const token = this.jwtService.sign({ id: users._id});
      const token = {
        AccessToken: this.jwtService.sign({ id: users._id}),
        RefreshToken: this.jwtService.sign({ id: users._id})
      };
      const user = {
        email: users.email,
        name: users.username
      };
      return {token, user};
    }else{
      throw new UnauthorizedException('Email Telah Terdaftar')
    }

  }

  async Login(loginUsersDto: LoginUsersDto): Promise<{token: { AccessToken: string, RefreshToken: string }, user: { email: string, name: string } }>{
    const { email, password } = loginUsersDto;
    const users = await this.UsersModel.findOne({ email });
    const findUsername = await this.UsersModel.findOne({ email });
    if(!users){
      throw new UnauthorizedException('Email Belum Terdaftar');
    }
    const ComparePass = await bcrypt.compare(password, users.password)
    if(!ComparePass){
      throw new UnauthorizedException('Password Salah');
    }
    const token = {
      AccessToken: this.jwtService.sign({ id: users._id}),
      RefreshToken: this.jwtService.sign({ id: users._id})
    };
    const user = {
      email: users.email,
      name: users.username
    };
    return {token, user};
    // const token = this.jwtService.sign({ id: User._id });
    // return {token}
  }

  async getDataByToken(token:string) : Promise<Users> {
    return this.UsersModel.findOne({ _id: token }).exec();
  }
}
