// infrastructure/adapters/inbound/http/controllers/auth.controller.ts

import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from 'src/core/application/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
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
