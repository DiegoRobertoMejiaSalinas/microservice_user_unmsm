import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/user/domain/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/domain/dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: UserRepository,
  ) {}

  async listAllUsers() {
    return await this._userRepository.find();
  }

  async findUserById(userId: number) {
    return await this._userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async createUser(body: CreateUserDto) {
    return await this._userRepository.save({
      ...body,
    });
  }

  async updateUser(userId: number, body: UpdateUserDto) {
    return await this._userRepository.save({
      id: userId,
      ...body,
    });
  }

  async deleteUser(userId: number) {
    return await this._userRepository.delete({
      id: userId,
    });
  }
}
