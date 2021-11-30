import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: 'number', name: 'userId' })
  @ManyToOne(() => User, (user) => user.address)
  @JoinColumn()
  user: User;

  @ApiProperty()
  @Column()
  street: string;

  @ApiProperty()
  @Column()
  streetNumber: number;

  @Column()
  district: string;

  @ApiProperty()
  @Column()
  city: string;

  @ApiProperty()
  @Column()
  country: string;
}
