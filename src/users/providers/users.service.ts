import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Post } from 'src/posts/providers/posts.service';
import { AuthService } from 'src/auth/providers/auth.service';

export interface User {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  posts: Post[];
}

@Injectable()
export class UsersService {
  private id: number = 0;
  private readonly users: User[] = [];

  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ): User[] {
    return this.users;
  }

  findById(id: string): User {
    const isAuth = this.authService.isAuth();

    console.log(isAuth);

    return this.users.find((u) => u.id === parseInt(id));
  }

  create(createUserDto: CreateUserDto): void {
    this.users.push({ id: this.id++, ...createUserDto, posts: [] });
  }
}
