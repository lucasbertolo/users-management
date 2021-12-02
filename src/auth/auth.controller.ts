import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { User } from '../entities/users.entity';
import RequestWithUser from './auth.interfaces';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/login.dto';
import { AuthRegisterDto } from './dto/register.dto';
import JwtAuthenticationGuard from './jwt-auth.guard';
import { LocalAuthGuard } from './localAuth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: AuthLoginDto })
  async login(@Req() request: RequestWithUser) {
    const { user } = request;

    const cookie = this.authService.getToken(user.id);

    request.res.setHeader('Set-Cookie', cookie);

    return user;
  }

  @Post('register')
  @ApiBody({ type: AuthRegisterDto })
  async register(@Body() user: User) {
    return this.authService.register(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logout(@Req() request: RequestWithUser) {
    request.res.setHeader('Set-Cookie', this.authService.clearToken());

    return true;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;

    return user;
  }
}
