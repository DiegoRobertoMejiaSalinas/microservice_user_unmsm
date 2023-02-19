import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller()
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
}
