import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import RequestWithUser from 'src/auth/auth.interfaces';
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
  add(@Body() address: Address, @Req() request: RequestWithUser) {
    return this.addressService.add(address, request.user);
  }

  @Put()
  @UseGuards(JwtAuthenticationGuard)
  edit(@Body() address: Address, @Req() request: RequestWithUser) {
    return this.addressService.update(address, request.user);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthenticationGuard)
  remove(@Param('id') id: number) {
    return this.addressService.remove(id);
  }
}
