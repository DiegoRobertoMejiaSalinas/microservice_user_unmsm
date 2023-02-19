import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { CreateUserDto } from "src/user/domain/dto/create-user.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService{
   constructor(@InjectRepository(UserEntity) private readonly _userRepository: UserRepository){}
   
   async listAllUsers(){
    return await this._userRepository.find()
   }

   async findUserById(userId: number){
    return await this._userRepository.findOne({
        where: {
            id: userId
        }
    })
   }

   async createUser(body: CreateUserDto){
    return await this._userRepository.save({
        ...body
    })
   }
}