import { UserDomainEntity } from "../../entities/user.domain-entity";

export interface IUserRepositoryPort {
  findByEmail(email: string): Promise<UserDomainEntity | null>;
  save(user: UserDomainEntity): Promise<UserDomainEntity>;
  findByConfirmationToken(token: string): Promise<UserDomainEntity | null>
}