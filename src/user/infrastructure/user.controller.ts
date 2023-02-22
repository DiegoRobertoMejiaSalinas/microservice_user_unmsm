import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.listAllUsers();
  }

  @Get(':id')
  async findUserById(@Param('id') userId: number) {
    return await this.userService.findUserById(userId);
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
  }

  @Put(':id')
  async updateUser(@Param('id') userId: number, @Body() body: UpdateUserDto) {
    return await this.userService.updateUser(userId, body);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: number) {
    return await this.userService.deleteUser(userId);
  }

  @MessagePattern('get_user_by_id')
  async findUserByIdPattern(
    @Payload() data: number,
  ) {
    return this.findUserById(data);
  }

  @MessagePattern('users_by_array_id')
  public async getUsersByIdArray(
    @Payload() data: number[],
  ): Promise<UserEntity[]> {
    return await this.userService.listUsersByIds(data);
  }
}
