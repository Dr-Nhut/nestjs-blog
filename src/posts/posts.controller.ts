import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { GetPostsParamDto } from './dto/getPosts.params.dto';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { GetPostsDto } from './dto/get-posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('/:userId?')
  findAll(
    @Param() getPostsParamDto: GetPostsParamDto,
    @Query() postsQuery: GetPostsDto,
  ) {
    console.log(postsQuery);
    return this.postsService.findAll(getPostsParamDto, postsQuery);
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Patch()
  update(@Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(updatePostDto);
  }

  @Delete()
  remove(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
