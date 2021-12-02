import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/users.entity';
import { UsersService } from '../../users/users.service';

describe('The UsersService', () => {
  let usersService: UsersService;
  let findOne: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne,
            insert: jest.fn().mockResolvedValue({}),
            delete: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    usersService = await module.get(UsersService);
  });

  describe('getByEmail', () => {
    describe('user exists', () => {
      let user: User;

      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });

      it('should return the user', async () => {
        const fetchedUser = await usersService.getByEmail('test@test.com');
        expect(fetchedUser).toEqual(user);
      });
    });

    describe('user does not exist', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });

      it('should throw an error', async () => {
        await expect(
          usersService.getByEmail('test@test.com'),
        ).rejects.toThrow();
      });
    });
  });

  describe('getById', () => {
    describe('user exists', () => {
      let user: User;

      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });

      it('should return the user', async () => {
        const fetchedUser = await usersService.getById(1);
        expect(fetchedUser).toEqual(user);
      });
    });

    describe('user does not exist', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });

      it('should throw an error', async () => {
        await expect(usersService.getById(2)).rejects.toThrow();
      });
    });
  });

  describe('add', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      findOne.mockReturnValue(Promise.resolve(user));
    });

    it('should create the user', async () => {
      const fetchedUser = await usersService.add(user);

      expect(fetchedUser).toBeTruthy();
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      const fetchedUser = await usersService.remove(1);

      expect(fetchedUser).toBeUndefined();
    });
  });
});
