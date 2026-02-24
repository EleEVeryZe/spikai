import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') 
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column({ name: 'password_hash' })
  passwordHash: string; 
}