import { IsString } from 'class-validator';

export class GetPostsParamDto {
  @IsString()
  userId: string;
}
