import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

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

  // findAll(
  //   getUsersParamDto: GetUsersParamDto,
  //   limit: number,
  //   page: number,
  // ): User1[] {
  //   return this.users;
  // }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // check if user already exists

    //test partial config
    console.log(this.profileConfiguation);

    const isExistUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (isExistUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = this.userRepository.create(createUserDto);

    return await this.userRepository.save(newUser);
  }
}
