import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { status } from '../enums/status.enum';
import { CreatePostMetaOptionsDto } from './createPostMetaOptions.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'How to Write a Great Blog Post',
    description: 'This is a title of blog post',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(postType)
  postType: postType;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug: string;

  @IsNotEmpty()
  @IsEnum(status)
  status: status;

  @ApiPropertyOptional({
    example: 'This is a comprehensive guide to writing a great blog post.',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsJSON()
  schema?: string;

  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @IsOptional()
  @IsISO8601()
  publishingOn?: Date;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true }) // string[]
  @MinLength(3, { each: true })
  tags: string[];

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          example: 'author',
        },
        value: {
          type: 'any',
          example: 'Archer',
        },
      },
    },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto[];
}
