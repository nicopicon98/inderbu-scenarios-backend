import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DATA_SOURCE } from 'src/infrastructure/tokens/data_sources';
import { DataSource } from 'typeorm';



/**
 * Provides functionality for managing full-text indexes in a MySQL database.
 * This service ensures that specific tables have the required full-text indexes
 * and creates them if they are missing. It is designed to work with MariaDB
 * and avoids issues with collation dependencies.
 *
 * @remarks
 * - The `onModuleInit` lifecycle hook is used to initialize the indexes when the module starts.
 * - The `ensure` method ensures that an index is created only if it does not already exist.
 * - The `hasIndex` method checks if a specific index exists on a table.
 * - The `createIndexes` method defines and applies the required full-text indexes for specific tables.
 *
 * @example
 * This provider is automatically initialized when the module starts, and it ensures
 * that the required full-text indexes are created for the following tables:
 * - `sub_scenarios` with index `ft_sub_name`
 * - `scenarios` with index `ft_scen_name`
 * - `activity_areas` with index `ft_area_name`
 * - `field_surface_types` with index `ft_fs_name`
 *
 * @see {@link https://mariadb.com/kb/en/full-text-indexes/} for more information on full-text indexes in MariaDB.
 */
@Injectable()
export class FulltextIndexProvider implements OnModuleInit {
  constructor(@Inject(DATA_SOURCE.MYSQL) private readonly ds: DataSource) {}

  /* ─────────────── hooks ─────────────── */
  async onModuleInit() {
    await this.createIndexes();
  }

  /* ─────────────── helpers ───────────── */

  /** ¿Existe ya el índice? – funciona en MariaDB y no depende de collation */
  private async hasIndex(table: string, index: string): Promise<boolean> {
    const rows = await this.ds.query(
      `SHOW INDEX FROM \`${table}\` WHERE Key_name = ?`,
      [index],
    );
    return (rows as any[]).length > 0;
  }

  /** Ejecuta el ALTER TABLE solo si falta; ignora duplicado en carrera */
  private async ensure(sql: string, table: string, index: string) {
    if (await this.hasIndex(table, index)) return;

    try {
      await this.ds.query(sql);
    } catch (e: any) {
      /* Otro proceso lo creó entre medias */
      if (e?.code !== 'ER_DUP_KEYNAME') throw e;
    }
  }

  /* ─────────────── creación de índices ─────────────── */

  private async createIndexes() {
    await this.ensure(
      `
      ALTER TABLE sub_scenarios
      ENGINE = InnoDB,
      MODIFY name VARCHAR(100)
             CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
      ADD FULLTEXT ft_sub_name (name);
      `,
      'sub_scenarios',
      'ft_sub_name',
    );

    await this.ensure(
      `
      ALTER TABLE scenarios
      ENGINE = InnoDB,
      MODIFY name VARCHAR(100)
             CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
      ADD FULLTEXT ft_scen_name (name);
      `,
      'scenarios',
      'ft_scen_name',
    );

    await this.ensure(
      `
      ALTER TABLE activity_areas
      ENGINE = InnoDB,
      MODIFY name VARCHAR(100)
             CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
      ADD FULLTEXT ft_area_name (name);
      `,
      'activity_areas',
      'ft_area_name',
    );

    await this.ensure(
      `
      ALTER TABLE field_surface_types
      ENGINE = InnoDB,
      MODIFY name VARCHAR(100)
             CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
      ADD FULLTEXT ft_fs_name (name);
      `,
      'field_surface_types',
      'ft_fs_name',
    );
  }
}
