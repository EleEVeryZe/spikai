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