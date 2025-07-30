import { 
  createParamDecorator, 
  InternalServerErrorException 
} from "@nestjs/common";

export const GetUser = createParamDecorator(
  (data : string, ctx) => {

    const req = ctx.switchToHttp().getRequest();
    
    if(!req.user) throw new InternalServerErrorException('User not found (request)');

    return data ? req.user?.[data] : req.user;
  }
)