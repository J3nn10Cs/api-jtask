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

  //Create a new user
  @Post('create-account')
  createUser(@Body() createUserAuthDto: CreateUserAuthDto) {
    return this.userAuthService.createUser(createUserAuthDto);
  }

  @Post('confirm-account')
  confirmAccount(@Body() confirmUserAuthDto: ConfirmUserAuthDto) {
    return this.userAuthService.confirmAccount(confirmUserAuthDto);
  }

  //login user
  @Post('login')
  // @ApiBearerAuth()
  // @Auth()
  login(@Body() loginUserAuthDto: LoginAuthDto) {
    return this.userAuthService.login(loginUserAuthDto);
  }

  //new code or token for user
  @Post('request-new-code')
  requestNewCode(@Body() requestNewCode: RequestNewCodeAuthDto) {
    return this.userAuthService.requestNewCode(requestNewCode);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordAuthDto: ForgotPasswordAuthDto) {
    return this.userAuthService.forgotPassword(forgotPasswordAuthDto);
  }

  //Validate token for user
  @Post('validate-token')
  validateToken(@Body() validateTokenAuthDto : ValidateTokenAuthDto){
    return this.userAuthService.validateToken(validateTokenAuthDto);
  }

  //Change password for user
  //The token is the user ID in this case
  @Post('/change-password/:token')
  changePassword(
    @Param('token') token : string,
    @Body() changePasswordAuthDto: ChangePasswordAuthDto
  ){
    return this.userAuthService.changePassword(+token, changePasswordAuthDto);
  }

  @Get('user')
  @Auth()
  authenticate(
    @GetUser() user : UserDocument
  ){
    return this.userAuthService.checkAuthStatus(user);
  }
}
