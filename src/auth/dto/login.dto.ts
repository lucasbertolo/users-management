import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@test.com' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  readonly password: string;
}
