import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/users.entity';
import { UsersService } from '../../users/users.service';
import { mockedConfigService, mockedJwtService } from '../../utils/mocks';
import { AuthService } from '../auth.service';

const mockedUser: User = {
  id: 1,
  email: 'test@test.com',
  firstName: 'test',
  lastName: 'test',
  password: 'password',
  address: [],
  birthDate: new Date().getTime(),
};

describe('Auth Service', () => {
  let authService: AuthService;
  let findOne: jest.Mock;

  let bcryptCompare: jest.Mock;

  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;
  });

  beforeEach(async () => {
    findOne = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
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
            insert: jest.fn().mockReturnValue(mockedUser),
          },
        },
      ],
    }).compile();

    authService = await module.get(AuthService);
  });

  describe('getToken', () => {
    it('should return the token', () => {
      const userId = 1;

      expect(typeof authService.getToken(userId)).toEqual('string');
    });
  });

  describe('clearToken', () => {
    it('should clear the token', () => {
      expect(authService.clearToken()).toContain('Authentication=;');
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      expect(await authService.register(mockedUser)).toEqual(true);
    });

    it('should throw error for user with invalid data', async () => {
      const failedUser = { ...mockedUser, password: null };

      expect(authService.register(failedUser as User)).rejects.toThrowError();
    });
  });

  describe('login', () => {
    describe('password is not valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });

      it('should throw an error', async () => {
        await expect(
          authService.login('user@email.com', 'strongPassword'),
        ).rejects.toThrow();
      });
    });

    describe('password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });

      describe('user exists', () => {
        beforeEach(() => {
          findOne.mockResolvedValue(mockedUser);
        });

        it('should return the user data', async () => {
          const user = await authService.login(
            'user@email.com',
            'strongPassword',
          );

          expect(user).toBe(mockedUser);
        });
      });

      describe('and the user does not exist', () => {
        beforeEach(() => {
          findOne.mockResolvedValue(undefined);
        });

        it('should throw an error', async () => {
          await expect(
            authService.login('user@email.com', 'strongPassword'),
          ).rejects.toThrow();
        });
      });
    });
  });
});
