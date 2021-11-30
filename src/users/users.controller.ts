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
import { User } from '../entities/users.entity';
import { UsersService } from './users.service';

@Controller('/users')
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

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  add(@Body() user: User) {
    return this.userService.add(user);
  }

  @Put()
  @UseGuards(JwtAuthenticationGuard)
  edit(@Body() user: User) {
    return this.userService.update(user);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthenticationGuard)
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
