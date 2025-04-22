import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({ example: 1 })
  readonly id: number;

  @ApiProperty({ example: 'user', description: 'Nombre del rol' })
  readonly name: string;

  @ApiProperty({ example: 'User Role', description: 'Descripción del rol' })
  readonly description: string;
}
