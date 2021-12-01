import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../auth/jwt-auth.guard';
import { User } from '../entities/users.entity';
import { UsersService } from './users.service';

@Controller('/users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getAll() {
    return this.userService.getAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthenticationGuard)
  getById(@Param('id') id: number) {
    return this.userService.getById(id);
  }

  @Get('email/:email')
  @UseGuards(JwtAuthenticationGuard)
  findByEmail(@Param('email') email: string) {
    return this.userService.getByEmail(email);
  }

  add(user: User) {
    return this.userService.add(user);
  }

  @Put()
  @UseGuards(JwtAuthenticationGuard)
  edit(@Body() user: User) {
    delete user.email;

    return this.userService.update(user);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthenticationGuard)
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
