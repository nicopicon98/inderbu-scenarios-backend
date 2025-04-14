import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { IUserApplicationPort } from 'src/core/application/ports/inbound/user-application.port';
import { UserResponseDto } from '../dtos/user/create-user-response.dto';
import { CreateUserDto } from '../dtos/user/create-user-request.dto';
import { UserResponseMapper } from 'src/infrastructure/mappers/user/user-response.mapper';

@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserApplicationPort')
    private readonly userApplicationService: IUserApplicationPort,
  ) {}
  @Post()
  @ApiOperation({
    summary:
      'Crea un nuevo usuario (validando contraseña y datos obligatorios)',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: UserResponseDto,
  })
  @ApiBody({ description: 'Datos del usuario a crear', type: CreateUserDto })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const userDomain = await this.userApplicationService.createUser(createUserDto);
    return UserResponseMapper.toDto(userDomain);
  }
}
