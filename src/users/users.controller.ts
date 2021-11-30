import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '../entities/users.entity';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  add(@Body() user: User) {
    return this.userService.add(user);
  }

  @Put()
  edit(@Body() user: User) {
    return this.userService.update(user);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
