import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import RequestWithUser from '../auth/auth.interfaces';
import JwtAuthenticationGuard from '../auth/jwt-auth.guard';
import { Address } from '../entities/address.entity';
import { AddressService } from './address.service';

@Controller('/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getAll(@Req() request: RequestWithUser) {
    return this.addressService.getAll(request.user);
  }

  @Get('/:id')
  @UseGuards(JwtAuthenticationGuard)
  getById(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.addressService.getById(id, request.user);
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

  @UseGuards(JwtAuthenticationGuard)
  @Get('/findByFilter/q?')
  getByFilter(
    @Query('country') country: string,
    @Query('city') city: string,
    @Query('district') district: string,
    @Query('street') street: string,
    @Req() request: RequestWithUser,
  ) {
    const data = { country, city, district, street };

    const withoutNull = Object.entries(data).filter(([, value]) => value);

    if (withoutNull.length === 0) {
      throw new HttpException(
        'Parameters do not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.addressService.getByFilter(
      Object.fromEntries(withoutNull),
      request.user,
    );
  }

  @Delete('/:id')
  @UseGuards(JwtAuthenticationGuard)
  remove(@Param('id') id: number) {
    return this.addressService.remove(id);
  }
}
