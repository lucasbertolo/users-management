import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from 'src/address/address.controller';
import { AddressModule } from 'src/address/address.module';
import { AddressService } from 'src/address/address.service';
import { UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { Address } from '../entities/address.entity';
import { User } from '../entities/users.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

console.log('process.env.MYSQL_PASSWORD', process.env.MYSQL_PASSWORD);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    UsersModule,
    AddressModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.MYSQL_PASSWORD,
      database: 'test',
      entities: [User, Address],
      synchronize: true,
    }),
  ],
  controllers: [AppController, UsersController, AddressController],
  providers: [AppService, UsersService, AddressService],
})
export class AppModule {}
