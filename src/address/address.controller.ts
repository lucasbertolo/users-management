import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Address } from '../entities/address.entity';
import { AddressService } from './address.service';

@Controller('/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Post()
  add(@Body() address: Address) {
    const mockUser = {
      firstName: 'Lucas',
      lastName: 'Bertolo',
      email: 'lucas.bertolo@ad.c',
      birthDate: new Date().getTime(),
      id: 1,
      password: 'audshhusda',
      address: [],
    };

    return this.addressService.add(address, mockUser);
  }

  @Put()
  edit(@Body() address: Address) {
    return this.addressService.update(address);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
