import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateNested,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { status } from '../enums/status.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/createPostMetaOptions.dto';
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

  @ApiProperty({
    type: 'array',
    items: {
      type: 'integer',
      example: 1,
    },
  })
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  tags: number[];

  @ApiProperty({
    type: 'integer',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  authorId: number;

  @ApiPropertyOptional({
    type: 'object',
    properties: {
      metaValue: {
        type: 'string',
        example: '{ "author": "Archer"}',
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOption?: CreatePostMetaOptionsDto | null;
}
