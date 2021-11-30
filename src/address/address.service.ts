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

  getAll(): Promise<Address[]> {
    return this.addressRepository.find();
  }

  getById(id: number): Promise<Address> {
    return this.addressRepository.findOne(id);
  }

  async add(address: Address, user: User) {
    const inserted = await this.addressRepository.insert({
      ...address,
      user,
    });

    return inserted;
  }

  async update(address: Address) {
    return this.addressRepository.update({ user: address.user }, address);
  }

  async remove(id: number): Promise<void> {
    await this.addressRepository.delete(id);
  }
}
