import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/user/domain/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/domain/dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { BcryptService } from 'src/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
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
    try {
      body.email = body.email.toLocaleLowerCase();

      const previouslyUserEmail = await this._userRepository.findOne({
        where: {
          email: body.email,
        },
      });

      if (previouslyUserEmail) {
        throw new BadRequestException({
          error: {
            type: 'already_used_email',
            message: 'El correo el usuario se ha utilizado previamente',
          },
        });
      }

      body.password = await this.bcryptService.hashPassword(body.password);

      await this._userRepository.save({
        ...body,
      });

      return {
        success: true,
        message: 'User created successfully',
      };
    } catch (e) {
      if (e?.response?.error?.type) throw e;

      throw new InternalServerErrorException({
        error: {
          type: 'error_creating_user',
          message: 'Hubo un error al crear el usuario',
        },
      });
    }
  }

  async updateUser(userId: number, body: UpdateUserDto) {
    await this._userRepository.save({
      id: userId,
      ...body,
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  }

  async deleteUser(userId: number) {
    return await this._userRepository.delete({
      id: userId,
    });
  }
}
