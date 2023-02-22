import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { BcryptService } from 'src/utils/bcrypt';
import { UserController } from './infrastructure/user.controller';
import { UserService } from './infrastructure/user.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserService,
    BcryptService,
    {
      provide: 'COURSE_SERVICE',
      useFactory: (configService: ConfigService) => {
        const connection = configService.get('RABBITMQ_CONNECTION');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [connection],
            queue: 'courses_queue',
            queueOptions: {
              durable: false,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [TypeOrmModule],
  controllers: [UserController],
})
export class UserModule {}
