import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import * as request from 'supertest';
import JwtAuthenticationGuard from '../../auth/jwt-auth.guard';
import { Address } from '../../entities/address.entity';
import { User } from '../../entities/users.entity';
import { UsersService } from '../../users/users.service';
import { mockedConfigService, mockedJwtService } from '../../utils/mocks';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';

let app: INestApplication;
let address;

const mockedAddress = {
  id: 1,
  city: 'piracicaba',
  country: 'br',
  district: 'nova piracicaba',
  street: 'rua 1',
  streetNumber: 1,
};

const mockedUser: User = {
  id: 1,
  email: 'test@test.com',
  address: [],
  password: 'password',
  firstName: 'test',
  lastName: 'testtest',
  birthDate: new Date().getTime(),
};

const mockedUser2: User = {
  id: 2,
  email: 'test@test.com',
  address: [],
  password: 'password',
  firstName: 'test',
  lastName: 'testtest',
  birthDate: new Date().getTime(),
};

describe('Address Controller', () => {
  let find: jest.Mock;
  let findOne: jest.Mock;
  let findOneUser: jest.Mock;

  beforeEach(async () => {
    address = { ...mockedAddress };
    findOne = jest.fn();
    find = jest.fn();
    findOneUser = jest.fn().mockResolvedValue(plainToClass(User, mockedUser));

    const module = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        UsersService,
        AddressService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(Address),
          useValue: {
            findOne,
            find,
          },
        },

        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: findOneUser,
          },
        },
      ],
    })
      .overrideGuard(JwtAuthenticationGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockedUser;
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('getById', () => {
    describe('with allowed user', () => {
      beforeEach(() => {
        findOne.mockResolvedValue(address);
      });

      it('should return the address', () => {
        return request(app.getHttpServer())
          .get('/address/1')
          .expect(200)
          .expect(address);
      });
    });

    describe('with non allowed user', () => {
      beforeEach(() => {
        findOneUser.mockResolvedValue(mockedUser2);
      });

      it('should not return the address', () => {
        return request(app.getHttpServer())
          .get('/address/1')
          .expect(200)
          .expect({});
      });
    });
  });

  describe('findByFilter', () => {
    describe('with valid filters and existent address', () => {
      beforeEach(() => {
        find.mockResolvedValue([address]);
      });

      it('should return list of addresses', () => {
        return request(app.getHttpServer())
          .get('/address/findByFilter/q?city=piracicaba&country=br')
          .expect(200)
          .expect([address]);
      });
    });

    describe('with valid filters and inexistent address', () => {
      beforeEach(() => {
        find.mockResolvedValue([]);
      });

      it('should return empty array', () => {
        return request(app.getHttpServer())
          .get('/address/findByFilter/q?city=campinas&country=br')
          .expect(200)
          .expect([]);
      });
    });

    describe('with invalid filters', () => {
      it('should throw error', () => {
        return request(app.getHttpServer())
          .get('/address/findByFilter/q?a=campinas&b=br')
          .expect(400);
      });
    });
  });
});
