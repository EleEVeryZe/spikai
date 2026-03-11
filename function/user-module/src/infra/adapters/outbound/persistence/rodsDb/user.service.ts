import { Password } from '@/domain/entity/password.model';
import { UserDomain } from '@/domain/entity/user.model';
import { UserRepository } from '@/domain/ports/user.repository.port';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';


@Injectable()
export class UserService implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly pgRepo: Repository<UserEntity>,
  ) {}
  async getUserById(id: number): Promise<UserDomain | null> {
    const record = await this.pgRepo.findOne({ where: { id } });

    if (!record) return null;

    const user = new UserDomain();
    user.id = record.id;
    user.email = record.email;
    user.username = record.username;
    user.hashedPassword = new Password(record.passwordHash);

    return user;
  }

  async create(user: UserDomain): Promise<UserDomain> {
    const newEntity = this.pgRepo.create({
      email: user.email,
      username: user.username,
      passwordHash: user.hashedPassword.getValue(),
    });

    const savedEntity = await this.pgRepo.save(newEntity);

    const savedUser = new UserDomain();
    savedUser.id = savedEntity.id;
    savedUser.email = savedEntity.email;
    savedUser.username = savedEntity.username;
    savedUser.hashedPassword = new Password(savedEntity.passwordHash);

    return savedUser;
  }

  async update(user: UserDomain): Promise<UserDomain> {
    const existingEntity = await this.pgRepo.findOne({ where: { id: user.id } });

    if (!existingEntity) {
      throw new Error(`User with id ${user.id} not found`);
    }

    existingEntity.email = user.email;
    existingEntity.username = user.username;
    existingEntity.passwordHash = user.hashedPassword.getValue();

    const updatedEntity = await this.pgRepo.save(existingEntity);

    const updatedUser = new UserDomain();
    updatedUser.id = updatedEntity.id;
    updatedUser.email = updatedEntity.email;
    updatedUser.username = updatedEntity.username;
    updatedUser.hashedPassword = new Password(updatedEntity.passwordHash);

    return updatedUser;
  }

  async getUserByEmail(email: string): Promise<UserDomain | null> {
    const record = await this.pgRepo.findOne({ where: { email } });

    if (!record) return null;

    const user = new UserDomain();
    user.id = record.id;
    user.email = record.email;
    user.username = record.username;
    
    user.hashedPassword = new Password(record.passwordHash);

    return user;
  }
}