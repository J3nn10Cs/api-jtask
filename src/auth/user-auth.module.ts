import { Module } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Users, UsersSchema } from './entities/user-auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-strategy';
import { Tokens, TokenSchema } from './entities/token.entity';

@Module({
  controllers: [UserAuthController],
  providers: [UserAuthService, JwtStrategy],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name : Users.name, schema : UsersSchema },
      { name : Tokens.name, schema : TokenSchema }
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports : [ ConfigModule, PassportModule],
      inject : [ ConfigService ],
      useFactory : ( configService : ConfigService ) => {
        return {
          secret : configService.get('JWT_SECRET'),
          signOptions : {
            expiresIn : '180d'
          }
        }
      }
    })
  ],
  exports : [
    MongooseModule,
    JwtStrategy,
    PassportModule,
    JwtModule
  ]
})
export class UserAuthModule {}
