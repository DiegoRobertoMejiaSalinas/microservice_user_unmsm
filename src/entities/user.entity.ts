import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bame: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password: string
}
