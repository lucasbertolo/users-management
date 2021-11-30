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

  getAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  getById(id: number): Promise<User> {
    const user = this.usersRepository.findOne(id);

    if (!user) {
      throw new HttpException('User non existent', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async add(user: User) {
    const inserted = await this.usersRepository.insert(user);

    return inserted;
  }

  async update(user: User) {
    return this.usersRepository.update({ id: user.id }, user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
