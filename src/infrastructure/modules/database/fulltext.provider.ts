import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { MYSQL_DATA_SOURCE } from '../../providers/database/database.providers';

@Injectable()
export class FulltextIndexProvider implements OnModuleInit {
  constructor(@Inject(MYSQL_DATA_SOURCE) private readonly ds: DataSource) {}

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
