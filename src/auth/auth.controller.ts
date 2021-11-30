import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '../entities/users.entity';
import RequestWithUser from './auth.interfaces';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './localAuth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;

    const cookie = this.authService.getToken(user.id);

    response.setHeader('Set-Cookie', cookie);

    return response.send(user);
  }

  @Post('register')
  async register(@Body() user: User) {
    return this.authService.register(user);
  }
}
