import { NeighborhoodEntity } from "src/infrastructure/persistence/neighborhood.entity";
import { PermissionEntity } from "src/infrastructure/persistence/permission.entity";
import { MenuItemEntity } from "src/infrastructure/persistence/menu-item.entity";
import { CommuneEntity } from "src/infrastructure/persistence/commune.entity";
import { ModuleEntity } from "src/infrastructure/persistence/module.entity";
import { CityEntity } from "src/infrastructure/persistence/city.entity";
import { RoleEntity } from "src/infrastructure/persistence/role.entity";
import { UserEntity } from "src/infrastructure/persistence/user.entity";

export const persistenceEntities = [
  UserEntity,
  RoleEntity,
  PermissionEntity,
  ModuleEntity,
  MenuItemEntity,
  NeighborhoodEntity,
  CommuneEntity,
  CityEntity,
];
