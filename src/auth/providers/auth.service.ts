import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { UserSignInDto } from '../dtos/user-signin.dto';
import { HasingProvider } from './hasing.provider';
import { User } from 'src/users/user.entity';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => HasingProvider))
    private hassingProvider: HasingProvider,
    @Inject()
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguation: ConfigType<typeof jwtConfig>,
  ) {}
  // public login(email: string, password: string, id: string) {
  //   const user = this.usersService.findById(id);
  //   console.log(user);
  //   return 'Sample token';
  // }

  public isAuth() {
    return true;
  }

  public async signIn(userSignInDto: UserSignInDto) {
    let user: User | undefined;
    try {
      user = await this.usersService.findByEmail(userSignInDto.email);
    } catch (err) {
      throw new RequestTimeoutException(err.message);
    }

    let isEqual: boolean = false;

    isEqual = await this.hassingProvider.comparePassword(
      userSignInDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect Password');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        audience: this.jwtConfiguation.audience,
        secret: this.jwtConfiguation.secret,
        issuer: this.jwtConfiguation.issuer,
        expiresIn: this.jwtConfiguation.access_token_ttl,
      },
    );

    return {
      accessToken,
    };
  }
}
