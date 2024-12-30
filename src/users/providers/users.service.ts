import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    //module configuation
    @Inject(profileConfig.KEY)
    private profileConfiguation: ConfigType<typeof profileConfig>,
  ) {}

  findAll(getUsersParamDto: GetUsersParamDto, limit: number, page: number) {
    //custom exception
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        message: 'This API endpoint is not supported',
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        description: 'This API endpoint is not supported',
        cause: new Error(),
      },
    );
  }

  async findById(id: number): Promise<User> {
    try {
      return this.userRepository.findOneBy({ id });
    } catch (err) {
      throw new RequestTimeoutException('This request timed out', {
        description: 'This data was not found',
      });
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // check if user already exists
    const isExistUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (isExistUser) {
      throw new BadRequestException('This email already exists');
    }

    const newUser = this.userRepository.create(createUserDto);

    try {
      return await this.userRepository.save(newUser);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
