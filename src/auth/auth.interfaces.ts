import { Request } from 'express';
import { User } from '../entities/users.entity';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;

export type Cookie = { userId: number; iat: number; exp: number };
