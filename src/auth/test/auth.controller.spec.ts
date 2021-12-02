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
import * as request from 'supertest';
import { User } from '../../entities/users.entity';
import { UsersService } from '../../users/users.service';
import { mockedConfigService, mockedJwtService } from '../../utils/mocks';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import JwtAuthenticationGuard from '../jwt-auth.guard';
import { LocalStrategy } from '../passport.strategy';

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

describe('Auth Controller', () => {
  let bcryptCompare: jest.Mock;

  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;
  });

  beforeEach(async () => {
    user = { ...mockedUser };

    const usersRepository = {
      insert: jest.fn().mockResolvedValue(plainToClass(User, user)),
      findOne: jest.fn().mockResolvedValue(plainToClass(User, user)),
    };

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UsersService,
        AuthService,
        LocalStrategy,
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
          useValue: usersRepository,
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

  describe('register', () => {
    describe('using valid data', () => {
      it('should respond with 201 to confirm the operation', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: mockedUser.email,
            password: 'password',
            firstName: 'test',
            lastName: 'testtest',
            birthDate: new Date().getTime(),
          })
          .expect(201);
      });
    });

    describe('using invalid data', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'testFail@test.com',
          })
          .expect(400);
      });
    });
  });

  describe('login', () => {
    describe('using valid credentials', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });

      it('should respond an user with password hidden', () => {
        const expectedData = { ...user };
        delete expectedData.password;

        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: mockedUser.email,
            password: 'password',
          })
          .expect(201)
          .expect(expectedData);
      });
    });

    describe('using invalid credentials', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });

      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'testFail@test.com',
            password: 'asuhdfhusdfhusahudf',
          })
          .expect(400);
      });
    });
  });

  describe('logout', () => {
    it('should return 201', () => {
      return request(app.getHttpServer()).post('/auth/logout').expect(201);
    });
  });

  describe('authenticate', () => {
    it('should return user', () => {
      return request(app.getHttpServer())
        .get('/auth/')
        .expect(200)
        .expect(user);
    });
  });
});
