import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserController } from './infrastructure/user.controller';
import { UserService } from './infrastructure/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  exports: [TypeOrmModule],
  controllers: [UserController]
})
export class UserModule {}
