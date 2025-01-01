import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HasingProvider } from 'src/auth/providers/hasing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => HasingProvider))
    private hasingProvider: HasingProvider,
  ) {}

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

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hasingProvider.hashPassword(createUserDto.password),
    });

    try {
      return await this.userRepository.save(newUser);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
