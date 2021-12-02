import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import JwtAuthenticationGuard from '../../auth/jwt-auth.guard';
import * as request from 'supertest';
import { User } from '../../entities/users.entity';
import { UsersService } from '../../users/users.service';
import { mockedConfigService, mockedJwtService } from '../../utils/mocks';
import { UsersController } from '../users.controller';

let app: INestApplication;
let user: User;

const mockedUser: User = {
  id: 1,
  email: 'test@test.com',
  address: [],
  password: 'password',
  firstName: 'test',
  lastName: 'testtest',
  birthDate: new Date().getTime(),
};

describe('Users Controller', () => {
  let bcryptCompare: jest.Mock;
  let findOne: jest.Mock;

  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;
  });

  beforeEach(async () => {
    user = { ...mockedUser };
    findOne = jest.fn();

    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne,
          },
        },
      ],
    })
      .overrideGuard(JwtAuthenticationGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = user;
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('findByEmail', () => {
    describe('with valid email', () => {
      beforeEach(() => {
        findOne.mockResolvedValue(plainToClass(User, user));
      });

      it('should return the user without password', () => {
        const expectedData = { ...user };

        delete expectedData.password;

        return request(app.getHttpServer())
          .get('/users/email/test@test.com')
          .expect(200)
          .expect(expectedData);
      });
    });

    describe('with inexistent email', () => {
      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(undefined);
      });

      it('should return error', () => {
        return request(app.getHttpServer())
          .get('/users/email/test2@test.com')
          .expect(404);
      });
    });
  });
});
