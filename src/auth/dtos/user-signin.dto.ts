import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UserSignInDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(96)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  password: string;
}
