import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User, UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/:id?')
  @ApiOperation({
    summary: 'Fetches a list of users',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    example: 1,
  })
  public findAll(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): User[] | User {
    if (!getUsersParamDto.id) {
      return this.usersService.findAll(getUsersParamDto, limit, page);
    }
    return this.usersService.findById(getUsersParamDto.id.toString());
  }

  @Post()
  public create(@Body() createUserDto: CreateUserDto): void {
    return this.usersService.create(createUserDto);
  }

  @Patch()
  public update(@Body() updateUserDto: UpdateUserDto): UpdateUserDto {
    return updateUserDto;
  }
}
