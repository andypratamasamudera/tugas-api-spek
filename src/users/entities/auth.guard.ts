// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Request } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Observable } from 'rxjs';
// import { ExtractJwt } from 'passport-jwt';

// @Injectable()
// export class AuthGuard implements CanActivate {
//     constructor(private jwtService: JwtService){}

//     private TokenFromHeader(request: Request): Promise<string | undefined >{
//         const [type, token] = 
//     }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const token = this.TokenFromHeader(request);
//         if(!token){
//             throw new UnauthorizedException();
//         }
//         try{
//             const payload = await this.jwtService.verifyAsync(
//                 token,{
//                     secret : 'Token-Secret',
//                 }
//             );
//             request['user'] = payload;
//         }catch{
//             throw new UnauthorizedException();
//         }
//         return true;
//     }
// }