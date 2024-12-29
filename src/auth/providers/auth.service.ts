import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}
  // public login(email: string, password: string, id: string) {
  //   const user = this.usersService.findById(id);
  //   console.log(user);
  //   return 'Sample token';
  // }

  public isAuth() {
    return true;
  }
}
