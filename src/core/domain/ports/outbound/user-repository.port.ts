import { UserDomainEntity } from "../../entities/user.domain-entity";

export interface IUserRepositoryPort {
  findByEmail(email: string): Promise<UserDomainEntity | null>;
  save(user: UserDomainEntity): Promise<UserDomainEntity>;
}