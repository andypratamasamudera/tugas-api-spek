import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { Users, UsersSchemma } from './entities/users.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtService,JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { JwtStrategy } from './entities/jwt.strategy';
 
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI,{dbName:"ApiSpek"}),
    MongooseModule.forFeature([{ name:Users.name, schema : UsersSchemma }]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory: ( config:ConfigService) =>{
        return{
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '1h',
          }
        }
      }
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class UsersModule {}
