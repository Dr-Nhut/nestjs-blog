import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

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

    private readonly usersCreateManyProvider: UsersCreateManyProvider,
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

  async findByEmail(email: string): Promise<User> {
    const user: User | undefined = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`Can't found user by ${email}`);
    }

    return user;
  }

  async createMany(createMultipleUsers: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createMultipleUsers);
  }
}
