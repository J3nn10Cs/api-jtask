import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Users } from "../entities/user-auth.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
//validation the JWT
export class JwtStrategy extends PassportStrategy( Strategy ) {

  constructor(
    @InjectModel(Users.name) 
    private readonly userRepository: Model<Users>,

    configService : ConfigService
  ){
    super({
      secretOrKey: configService.get('JWT_SECRET')!,
      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async validate (payload : JwtPayload) : Promise<Users> {

    const { id } = payload;

    const user = await this.userRepository.findById(id);

    if(!user) 
      throw new UnauthorizedException('Token is not valid');

    if(!user.isActive)
      throw new UnauthorizedException('User is not active');

    return user;
  }

}