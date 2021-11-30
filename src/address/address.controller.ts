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

  @Post('/:id')
  add(@Param('id') userId: string, @Body() address: Address) {
    return this.addressService.add(userId, address);
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
