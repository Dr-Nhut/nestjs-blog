import {
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

@Injectable()
export class PostsService {
  constructor(
    private usersService: UsersService,
    private tagsService: TagsService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async findAll(getPostsParamDto: GetPostsParamDto): Promise<Post[]> {
    // const user = this.usersService.findById(getPostsParamDto.userId);
    // if (!user) {
    //   throw new Error('User not found');
    // }

    const posts = await this.postRepository.find({
      relations: {
        metaOption: true,
        author: true,
        tags: true,
      },
    });

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
