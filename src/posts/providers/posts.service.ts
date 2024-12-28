import { Injectable } from '@nestjs/common';
import { GetPostsParamDto } from '../dto/getPosts.params.dto';
import { UsersService } from 'src/users/providers/users.service';

export interface Post {
  title: string;
  content: string;
}

@Injectable()
export class PostsService {
  constructor(private usersService: UsersService) {}
  findAll(getPostsParamDto: GetPostsParamDto): Post[] {
    const user = this.usersService.findById(getPostsParamDto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user.posts;
  }
}
