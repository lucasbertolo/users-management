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
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<Address[]> {
    return this.addressRepository.find();
  }

  findOne(id: string): Promise<Address> {
    return this.addressRepository.findOne(id);
  }

  async add(userId: string, address: Address) {
    const inserted = await this.addressRepository.insert(address);

    return inserted;
  }

  async update(address: Address) {
    return this.addressRepository.update({ user: address.user }, address);
  }

  async remove(id: string): Promise<void> {
    await this.addressRepository.delete(id);
  }
}
