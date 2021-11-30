import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../auth/jwt-auth.guard';
import { Address } from '../entities/address.entity';
import { AddressService } from './address.service';

@Controller('/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getAll() {
    return this.addressService.getAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthenticationGuard)
  getById(@Param('id') id: number) {
    return this.addressService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
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
  @UseGuards(JwtAuthenticationGuard)
  edit(@Body() address: Address) {
    return this.addressService.update(address);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthenticationGuard)
  remove(@Param('id') id: number) {
    return this.addressService.remove(id);
  }
}
