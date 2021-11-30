import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from '../entities/users.entity';
import RequestWithUser from './auth.interfaces';
import { AuthService } from './auth.service';
import JwtAuthenticationGuard from './jwt-auth.guard';
import { LocalAuthGuard } from './localAuth.guard';

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

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logout(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.clearToken());

    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;

    return user;
  }
}
