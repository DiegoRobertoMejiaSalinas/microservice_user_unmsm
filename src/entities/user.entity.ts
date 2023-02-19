import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true
  })
  email: string;

  @Exclude()
  @Column({select: false})
  password: string
}
