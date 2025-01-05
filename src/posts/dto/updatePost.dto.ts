import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './createPost.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
