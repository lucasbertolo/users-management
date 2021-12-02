import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as yup from 'yup';
import { User } from '../entities/users.entity';
import { UsersService } from '../users/users.service';
import { getValidationError } from '../utils/validation';

const userValidationSchema = yup.object().shape({
  password: yup.string().min(8).required(),
  email: yup.string().required(),
  birthDate: yup.number().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(user: User) {
    try {
      await userValidationSchema.validate(user, { abortEarly: false });

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await this.userService.add({
        ...user,
        password: hashedPassword,
      });

      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new HttpException(
          JSON.stringify(getValidationError(error)),
          HttpStatus.BAD_REQUEST,
        );
      }

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
