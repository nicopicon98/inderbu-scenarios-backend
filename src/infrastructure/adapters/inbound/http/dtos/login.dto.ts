// src/common/dto/login.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'contraseña_segura',
  })
  @IsString()
  password: string;
}
