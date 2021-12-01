import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(user: User) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await this.userService.add({
        ...user,
        password: hashedPassword,
      });

      return true;
    } catch (error) {
      if (error?.driverError?.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'User already existent',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Something has gone wrong, try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(email: string, hashedPassword: string) {
    let user: User | undefined;

    try {
      user = await this.userService.getByEmail(email);
    } catch (error) {
      throw new HttpException('Error trying to login', HttpStatus.BAD_REQUEST);
    }

    const hasAccount = await bcrypt.compare(
      hashedPassword,
      user?.password || '',
    );

    if (!hasAccount) {
      throw new HttpException('Error trying to login', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  getToken(userId: number) {
    const payload = { userId };
    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  clearToken() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
