import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/users.entity';
import { UsersService } from '../../users/users.service';
import { mockedConfigService, mockedJwtService } from '../../utils/mocks';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';

const testUser1 = {
  birthDate: new Date().getTime(),
  email: 'test@test.com',
  firstName: 'firstName',
  lastName: 'lastName',
  password: '123132321',
};

const testUser2 = {
  birthDate: new Date().getTime(),
  email: 'test2@test.com',
  firstName: 'firstName',
  lastName: 'lastName',
  password: 'aaaaa',
};

const testUsersList = [testUser1, testUser2];

describe('The authService', () => {
  let authService: AuthService;
  let findOne: jest.Mock;

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
            find: jest.fn().mockResolvedValue(testUsersList),
            findOne,
            insert: jest.fn().mockReturnValue(testUser1),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
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
      expect(await authService.register(testUser1 as User)).toEqual(true);
    });

    it('should throw error for user with invalid data', async () => {
      const failedUser = { ...testUser1, password: null };

      expect(authService.register(failedUser as User)).rejects.toThrowError();
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash(testUser1.password, 10);

      const user = { ...testUser1, password: hashedPassword };

      findOne.mockReturnValue(Promise.resolve(user));
    });

    it('should return the user', async () => {
      const fetchedUser = await authService.login(
        testUser1.email,
        testUser1.password,
      );

      const mockUser = { ...testUser1, password: undefined };

      delete fetchedUser.password;

      expect(fetchedUser).toEqual(mockUser);
    });

    describe('and the user is not matched', () => {
      it('should throw an error', async () => {
        await expect(
          authService.login(testUser1.email, testUser1.password + 'aaaa'),
        ).rejects.toThrow();
      });
    });
  });
});
