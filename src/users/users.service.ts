import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new HttpException('Email non existent', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async add(user: User) {
    const inserted = await this.usersRepository.insert(user);

    return inserted;
  }

  async update(user: User) {
    return this.usersRepository.update({ id: user.id }, user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
