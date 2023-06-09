import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.schema';
import { UsersModule } from './../users.module';
import { Model } from 'mongoose';
import { User } from './user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(Users.name)
        private UsersModule: Model<Users>,
    ){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : process.env.JWT_SECRET
        });
    }

    async validation(payload) {
        const id = {payload};

        const User = await this.UsersModule.findById(id);
        if(!User){
            throw new UnauthorizedException(" Validation Error Login Terlebih Dahulu")
        }
    }
}