import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';

import { IUserApplicationPort } from 'src/core/application/ports/inbound/user-application.port';
import { UserResponseMapper } from 'src/infrastructure/mappers/user/user-response.mapper';
import { UserResponseDto } from '../dtos/user/create-user-response.dto';
import { APPLICATION_PORTS } from 'src/core/application/tokens/ports';
import { CreateUserDto } from '../dtos/user/create-user-request.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject(APPLICATION_PORTS.USER)
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
