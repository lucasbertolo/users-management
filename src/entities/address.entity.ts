import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.address)
  user: User;

  @Column()
  street: string;

  @Column()
  streetNumber: number;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  country: string;
}
