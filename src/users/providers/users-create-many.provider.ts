import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    /**
     * Inject DataSource
     */
    private readonly dataSource: DataSource,
  ) {}
  async createMany(createMultipleUsers: CreateManyUsersDto) {
    const newUsers: User[] = [];
    //Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      //Connect queryRunner to datasource
      await queryRunner.connect();

      //Start transaction
      await queryRunner.startTransaction();
    } catch (err) {
      console.error(err);
      throw new RequestTimeoutException('Could not connect to database');
    }

    try {
      for (const user of createMultipleUsers.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);

        //if successful
        await queryRunner.commitTransaction();
      }
    } catch (err) {
      //if unsuccessful
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete transaction', {
        description: String(err),
      });
    } finally {
      //Release the transaction
      try {
        await queryRunner.release();
      } catch (error) {
        console.error(error);
        throw new RequestTimeoutException('Could not connect to database', {
          description: String(error),
        });
      }
      return newUsers;
    }
  }
}
