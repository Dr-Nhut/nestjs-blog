import {
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetPostsParamDto } from '../dto/getPosts.params.dto';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { CreatePostDto } from '../dto/createPost.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { UpdatePostDto } from '../dto/updatePost.dto';
import { GetPostsDto } from '../dto/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';

@Injectable()
export class PostsService {
  constructor(
    private usersService: UsersService,
    private tagsService: TagsService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAll(
    getPostsParamDto: GetPostsParamDto,
    postsQuery: GetPostsDto,
  ): Promise<Paginated<Post>> {
    const posts = await this.paginationProvider.paginateQuery(
      this.postRepository,
      postsQuery,
    );

    return posts;
  }

  public async create(createPostDto: CreatePostDto): Promise<Post> {
    let author = undefined,
      tags = undefined;

    try {
      author = await this.usersService.findById(createPostDto.authorId);
      tags = await this.tagsService.findMultipleById(createPostDto.tags);
    } catch (err) {
      throw new RequestTimeoutException('The request timed out', {
        description: 'The database was not found',
      });
    }

    if (!author) {
      throw new NotFoundException('The author was not found');
    }

    if (tags?.length !== createPostDto.tags.length) {
      throw new NotFoundException('The tags was not found');
    }

    //Create new post
    const newPost = this.postRepository.create({
      ...createPostDto,
      author,
      tags,
    });
    // return save
    try {
      return await this.postRepository.save(newPost);
    } catch (err) {
      throw new RequestTimeoutException('The request timed out', {
        description: 'The database was not found',
      });
    }
  }

  public async update(updatePostDto: UpdatePostDto) {
    //find the tags
    const tags = await this.tagsService.findMultipleById(updatePostDto.tags);

    //find the post
    const post = await this.postRepository.findOneBy({ id: updatePostDto.id });

    //update the post
    Object.keys(updatePostDto).forEach((key) => {
      post[key] = updatePostDto[key] ?? post[key];
    });
    post.tags = tags;
    //save the post
    return await this.postRepository.save(post);
  }

  public async delete(id: number): Promise<{ deleted: number }> {
    await this.postRepository.delete(id);

    return {
      deleted: id,
    };
  }
}
