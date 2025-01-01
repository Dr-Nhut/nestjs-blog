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
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { User } from './user.entity';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // @Get('/:id?')
  // @ApiOperation({
  //   summary: 'Fetches a list of users',
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   type: 'number',
  //   required: false,
  //   example: 10,
  // })
  // @ApiQuery({
  //   name: 'page',
  //   type: 'number',
  //   required: false,
  //   example: 1,
  // })
  // public findAll(
  //   @Param() getUsersParamDto: GetUsersParamDto,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  // ): User1[] | User1 {
  //   if (!getUsersParamDto.id) {
  //     return this.usersService.findAll(getUsersParamDto, limit, page);
  //   }
  //   return this.usersService.findById(getUsersParamDto.id.toString());
  // }

  @Post()
  public create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post('create-many')
  public createMany(
    @Body() createManyUsersDto: CreateManyUsersDto,
  ): Promise<User[]> {
    return this.usersService.createMany(createManyUsersDto);
  }

  @Patch()
  public update(@Body() updateUserDto: UpdateUserDto): UpdateUserDto {
    return updateUserDto;
  }
}
