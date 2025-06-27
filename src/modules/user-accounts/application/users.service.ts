import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { User, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    //инжектирование модели в сервис через DI
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    //TODO: move to bcrypt service
    const passwordHash = await bcrypt.hash(dto.password, +process.env.COST_FACTOR! as number);

    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
    });

    await this.usersRepository.save(user);

    return user._id.toString();
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOrNotFoundFail(id);

    user.makeDeleted();

    await this.usersRepository.save(user);
  }
}
