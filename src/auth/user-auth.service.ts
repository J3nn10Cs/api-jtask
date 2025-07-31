  import { 
    BadRequestException, 
    Injectable, 
    InternalServerErrorException, 
    Logger 
  } from '@nestjs/common';
  import { CreateUserAuthDto } from './dto/auth/create-user-auth.dto';
  import { 
    ChangePasswordAuthDto, 
    ConfirmUserAuthDto, 
    ForgotPasswordAuthDto, 
    LoginAuthDto, 
    RequestNewCodeAuthDto, 
    ValidateTokenAuthDto 
  } from './dto';
  import { UserDocument, Users } from './entities/user-auth.entity';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import * as bcrypt from 'bcrypt'
  import { TokenDocument, Tokens } from './entities/token.entity';
  import { generateToken } from './utils/token';
  import { JwtService } from '@nestjs/jwt';
  import { JwtPayload } from './interfaces/jwt-payload.interface';
  import { AuthEmail } from './utils/emails/AuthEmail';

  @Injectable()
  export class UserAuthService {

    private readonly logger = new Logger('AuthService');

    constructor(
      @InjectModel(Users.name)
      private usersModel : Model<UserDocument>,

      @InjectModel(Tokens.name)
      private tokensModel : Model<TokenDocument>,

      private readonly jwtService: JwtService
    ){}

    async createUser(createUserAuthDto: CreateUserAuthDto) {
      try {
        const { password, email, ...data } = createUserAuthDto;

        const userExists = await this.verifyUserExists(email);

        const user = new this.usersModel({
          ...data,
          email : email.toLowerCase(),
          password : bcrypt.hashSync(password, 10)
        })

        const token = new this.tokensModel()
        token.user = user.id
        token.token = generateToken()

        if(!userExists) {
          await this.sendConfirmationEmail(user, token.token);
        }

        await Promise.allSettled([
          user.save(),
          token.save()
        ])

        return 'Se envio un nuevo token de confirmación a tu correo electrónico'

      } catch (error) {
        this.handleDBExceptions(error);
      }
    }

    async confirmAccount(confirmUserAuthDto : ConfirmUserAuthDto) {
      const { token } = confirmUserAuthDto;

      const tokenExists = await this.validateExistingToken(token);

      const user = await this.usersModel.findById(tokenExists.user);

      if (!user) {
        throw new BadRequestException('El usuario no existe');
      }

      user.confirmed = true;

      await Promise.allSettled([
        this.tokensModel.deleteOne({ token: tokenExists.token }),
        user.save()
      ])

      return 'Cuenta confirmada correctamente';
    }

    async login(loginUserAuthDto: LoginAuthDto) {
      try {
        const { email, password } = loginUserAuthDto;

        const user = await this.verifyUserExists(email);

        if (!user) {
          throw new BadRequestException('Credenciales incorrectas');
        }

        if(!user.confirmed){
          const token = await this.createAndSaveToken(user.id);

          await this.sendConfirmationEmail(user, token.token);

          throw new BadRequestException('La cuenta no ha sido confirmada, se ha enviado otro email de confirmacion');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
          throw new BadRequestException('Contraseña incorrecta');
        }

        const token = this.getJwtToken({id : user.id});

        return token

      } catch (error) {
        throw error;
      }
    }

    async requestNewCode(requestNewCode: RequestNewCodeAuthDto) {

      try {
        const { email } = requestNewCode;
    
        const user = await this.verifyUserExists(email);
    
        if(!user){
          throw new BadRequestException('El usuario no existe');
        }

        if(user.confirmed){
          throw new BadRequestException('El usuario ya esta confirmado');
        }

        const token = await this.createAndSaveToken(user.id);

        await this.sendConfirmationEmail(user, token.token);

        await Promise.allSettled([
          user.save(),
          token.save()
        ])

        return 'Se ha enviado un nuevo token de confirmación a tu correo electrónico';
      } catch (error) {
        throw error;
      }
    }

    async forgotPassword(forgotPasswordAuthDto: ForgotPasswordAuthDto) {
      try {
        const { email } = forgotPasswordAuthDto;
        const user = await this.verifyUserExists(email);

        if(!user){
          throw new BadRequestException('El usuario no está registrado');
        }

        const token = await this.createAndSaveToken(user.id);

        await this.sendPasswordForgot(user, token.token);

        return 'Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña';

      } catch (error) {
        throw error;
      }
    }

    async validateToken(validateTokenAuthDto: ValidateTokenAuthDto) {
      try {
        const { token } = validateTokenAuthDto;

        await this.validateExistingToken(token);

        return 'Token válido';

      } catch (error) {
        throw error;
      }
    }

    async changePassword(
      token: string,
      changePasswordAuthDto: ChangePasswordAuthDto
    ) {
      
      try {
        
        const { password } = changePasswordAuthDto;
        const tokenValidate = await this.validateExistingToken(token);
        const user = await this.usersModel.findById(tokenValidate.user);
  
        if(user){
          user.password = bcrypt.hashSync(password, 10)
        } else {
          throw new BadRequestException('El usuario no existe');
        }

        await Promise.allSettled([
          user.save(),
          this.tokensModel.deleteOne()
        ]);

        return 'Contraseña cambiada correctamente';
      } catch (error) {
        throw error
      }
    }

    checkAuthStatus(user : UserDocument) {
      return {
          _id : user.id,
          email : user.email,
          name : user.name
        // token : this.getJwtToken({ id : user.id })
      }
    }

    verifyUserExists(email: string) {
      return this.usersModel.findOne({ email });
    }

    private getJwtToken(payload : JwtPayload){
      const token = this.jwtService.sign(payload);

      return token
    }

    private async sendConfirmationEmail(user: UserDocument, token: string) {
      await AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token,
      });
    }

    private async sendPasswordForgot(user: UserDocument, token: string) {
      await AuthEmail.sendPasswordForgot({
        email: user.email,
        name: user.name,
        token,
      });
    }

    private async createAndSaveToken(userId: string) {
      const token = new this.tokensModel();
      token.token = generateToken();
      token.user = userId;
      await token.save();
      return token;
    }

    private async validateExistingToken(token: string) {
      const tokenExists = await this.tokensModel.findOne({ token });
      if (!tokenExists) {
        throw new BadRequestException('Token no válido o expirado');
      }
      return tokenExists;
    }

    private handleDBExceptions(error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Ya existe un usuario con ese correo');
      }

      if(error.code === '23505')
        throw new BadRequestException(error.detail);

      this.logger.error(`Error creating User: ${error.message}`, error.stack);

      throw new InternalServerErrorException(`Unexpected error, check server logs`);
    }
  }
