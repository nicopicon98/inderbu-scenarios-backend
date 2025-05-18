import { UserDomainEntity } from "src/core/domain/entities/user.domain-entity";
import { CreateUserDto } from "src/infrastructure/adapters/inbound/http/dtos/user/create-user-request.dto";
import { PageOptionsDto } from "src/infrastructure/adapters/inbound/http/dtos/common/page-options.dto";
import { PageDto } from "src/infrastructure/adapters/inbound/http/dtos/common/page.dto";
import { UserWithRelationsDto } from "src/infrastructure/adapters/inbound/http/dtos/user/user-with-relations.dto";

export interface IUserApplicationPort {
  createUser(createUserDto: CreateUserDto): Promise<UserDomainEntity>;
  findByEmail(email: string): Promise<UserDomainEntity | null>;
  confirmUser(token: string): Promise<{ message: string }>;
  resendConfirmation(email: string): Promise<{ message: string }>;

  // Nuevos métodos para listar usuarios
  getAllUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserWithRelationsDto>>;
  getUsersByRole(roleId: number, pageOptionsDto: PageOptionsDto): Promise<PageDto<UserWithRelationsDto>>;
  getUserById(id: number): Promise<UserWithRelationsDto>;
}
