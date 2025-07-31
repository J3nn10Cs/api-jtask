import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { 
  ChangePasswordAuthDto, 
  ConfirmUserAuthDto, 
  CreateUserAuthDto, 
  ForgotPasswordAuthDto, 
  LoginAuthDto, 
  RequestNewCodeAuthDto, 
  ValidateTokenAuthDto 
} from './dto';
import { UserDocument } from './entities/user-auth.entity';
import { Auth, GetUser } from './decorators';

@Controller('auth')
export class UserAuthController {
  constructor(
    private readonly userAuthService: UserAuthService
  ) {}

  @Post('create-account')
  createUser(@Body() createUserAuthDto: CreateUserAuthDto) {
    return this.userAuthService.createUser(createUserAuthDto);
  }

  @Post('confirm-account')
  confirmAccount(@Body() confirmUserAuthDto: ConfirmUserAuthDto) {
    return this.userAuthService.confirmAccount(confirmUserAuthDto);
  }

  @Post('login')
  // @ApiBearerAuth()
  login(@Body() loginUserAuthDto: LoginAuthDto) {
    return this.userAuthService.login(loginUserAuthDto);
  }

  @Post('request-new-code')
  requestNewCode(@Body() requestNewCode: RequestNewCodeAuthDto) {
    return this.userAuthService.requestNewCode(requestNewCode);
  }

  @Post('forgot-password')
  forgotPassword(
    @Body() forgotPasswordAuthDto: ForgotPasswordAuthDto
  ) {
    return this.userAuthService.forgotPassword(forgotPasswordAuthDto);
  }

  @Post('validate-token')
  validateToken(
    @Body() validateTokenAuthDto : ValidateTokenAuthDto
  ){
    return this.userAuthService.validateToken(validateTokenAuthDto);
  }

  @Post('/change-password/:token')
  changePassword(
    @Param('token') token : string,
    @Body() changePasswordAuthDto: ChangePasswordAuthDto
  ){
    return this.userAuthService.changePassword(token, changePasswordAuthDto);
  }

  @Get('user')
  @Auth()
  authenticate(
    @GetUser() user : UserDocument
  ){
    return this.userAuthService.checkAuthStatus(user);
  }
}
