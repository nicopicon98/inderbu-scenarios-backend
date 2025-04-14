import { UserDomainEntity } from "src/core/domain/entities/user.domain-entity";
import { CreateUserDto } from "src/infrastructure/adapters/inbound/http/dtos/user/create-user-request.dto";

export interface IUserApplicationPort {
  createUser(createUserDto: CreateUserDto): Promise<UserDomainEntity>;
  findByEmail(email: string): Promise<UserDomainEntity | null>;
}
