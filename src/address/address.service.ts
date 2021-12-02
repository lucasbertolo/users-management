import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async getAll(user: User): Promise<Address[]> {
    return this.addressRepository.find({ user });
  }

  async getById(id: number, user: User): Promise<Address> {
    return this.addressRepository.findOne({ id, user });
  }

  async getByFilter(
    params: { [key: string]: string },
    user: User,
  ): Promise<Address[]> {
    return this.addressRepository.find({ ...params, user });
  }

  async add(address: Address, user: User) {
    const inserted = await this.addressRepository.insert({
      ...address,
      user,
    });

    return inserted;
  }

  async update(address: Address, user: User) {
    return this.addressRepository.update({ user, id: address.id }, address);
  }

  async remove(id: number): Promise<void> {
    await this.addressRepository.delete(id);
  }
}
