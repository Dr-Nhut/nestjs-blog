import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { GetPostsParamDto } from './dto/getPosts.params.dto';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('/:userId?')
  findAll(@Param() getPostsParamDto: GetPostsParamDto) {
    return this.postsService.findAll(getPostsParamDto);
  }

  @Post('/:userId')
  create(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
    return 'This is a new post';
  }

  @Patch('/:userId')
  update(@Body() updatePostDto: UpdatePostDto) {
    console.log(updatePostDto);
    return 'This is a update post';
  }
}
