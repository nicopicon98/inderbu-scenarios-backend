// infrastructure/adapters/inbound/http/controllers/auth.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthenticationService } from 'src/core/application/services/auth.service';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('login')
  @ApiOperation({ summary: 'Inicia sesión con correo electrónico y contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
    schema: {
      example: {
        access_token: 'jwt_token_aqui',
      },
    },
  })
  @ApiBody({
    description: 'Credenciales de inicio de sesión',
    type: LoginDto,
  })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }

  // Endpoint protegido que requiere un JWT válido
  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
