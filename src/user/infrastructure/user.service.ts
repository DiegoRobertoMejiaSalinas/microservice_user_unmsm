import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/user/domain/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/domain/dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { BcryptService } from 'src/utils/bcrypt';
import { In } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    @Inject('COURSE_SERVICE') private readonly courseClient: ClientProxy,
  ) {
    this.courseClient.connect();
  }

  async listUsersByIds(usersIdArray: number[]) {
    return await this._userRepository.find({
      where: {
        id: In(usersIdArray),
      },
    });
  }

  async listAllUsers() {
    return await this._userRepository.find();
  }

  async findUserById(userId: number) {
    const foundUser = await this._userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!foundUser) return null;

    const enrolledCourses = await lastValueFrom(
      this.courseClient.send('courses_by_user_id', foundUser.id),
    );

    foundUser.courses = enrolledCourses;

    return foundUser;
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
    try {
      const foundUser = await this._userRepository.findOne({
        where: { id: userId },
      });

      if (!foundUser) {
        throw new NotFoundException({
          error: {
            type: 'not_found_user',
            message: 'El usuario que intenta eliminar no existe',
          },
        });
      }

      const deletedEnrollments = await lastValueFrom(
        this.courseClient.send('delete_enrolled_user_by_id', foundUser.id),
      );

      if (!deletedEnrollments) {
        throw new InternalServerErrorException({
          error: {
            type: 'error_deleting_user',
            message: 'Ocurrio un error al eliminar el usuario',
          },
        });
      }

      await this._userRepository.delete({
        id: userId,
      });

      return {
        success: true,
        message: 'Se eliminó el usuario con exito',
      };
    } catch (e) {
      if (e?.response?.error?.type) throw e;

      throw new InternalServerErrorException({
        error: {
          type: 'error_deleting_user',
          message: 'Ocurrio un error al eliminar el usuario',
        },
      });
    }
  }
}
