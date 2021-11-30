import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Address } from './address.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ type: 'bigint' })
  birthDate: number;

  @OneToMany(() => Address, (address) => address.user, {
    cascade: true,
    eager: true,
  })
  address: Address[];
}
