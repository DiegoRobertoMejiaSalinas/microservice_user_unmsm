import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { BcryptService } from 'src/utils/bcrypt';
import { UserController } from './infrastructure/user.controller';
import { UserService } from './infrastructure/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, BcryptService],
  exports: [TypeOrmModule],
  controllers: [UserController]
})
export class UserModule {}
