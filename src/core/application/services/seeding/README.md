# Seeder Integration Guide

Este documento describe, paso a paso cómo crear e integrar nuevos *seeders* en este proyecto NestJS con TypeORM, siguiendo el patrón `AbstractSeeder`.

---

## 📦 Estructura del Proyecto

```text
src/
├─ core/
│  └─ application/
│     └─ services/
│        └─ seeding/
│           ├─ interfaces/
│           │  ├─ data-loader.interface.ts
│           │  ├─ seeder.interface.ts
│           │  ├─ time-slot-seed.interface.ts         # ← Nuevos
│           │  └─ reservation-state-seed.interface.ts # ← Nuevos
│           └─ seeders/
│              ├─ abstract.seeder.ts
│              ├─ city.seeder.ts
│              ├─ time-slot.seeder.ts                 # ← Ejemplo
│              └─ reservation-state.seeder.ts         # ← Ejemplo
├─ infrastructure/
│  ├─ persistence/
│  │  ├─ city.entity.ts
│  │  ├─ time-slot.entity.ts                        # ← Nuevos
│  │  └─ reservation-state.entity.ts                # ← Nuevos
│  ├─ seeds/
│  │  ├─ city-seeds.json
│  │  ├─ time-slot-seeds.json                       # ← Nuevos
│  │  └─ reservation-state-seeds.json               # ← Nuevos
│  └─ providers/
│     ├─ repository-entities.providers.ts
│     ├─ loader-strategy.providers.ts
│     └─ seeder.providers.ts
└─ data-loader/                                      # (e.g. JsonLoaderStrategy)

```

---

## 🚀 Pasos para Añadir un Nuevo Seeder

Sigue estos pasos cada vez que necesites crear e integrar un *seeder* para una nueva entidad:

### 1. Definir la Interfaz de Seed

En `src/core/application/services/seeding/interfaces/`, crea un archivo `<tu-entidad>-seed.interface.ts`:
```ts
export interface I<Entidad>Seed {
  // Campos exactos según tu entidad y JSON
  campo1: Tipo;
  campo2: Tipo;
}
```
Ejemplo: `ITimeSlotSeed` con `startTime` y `endTime`.

### 2. Crear el JSON de Seeds

En `src/infrastructure/seeds/`, crea `<tu-entidad>-seeds.json`:
```json
[
  { "campo1": "valor1", "campo2": 123 },
  { "campo1": "valor2", "campo2": 456 }
]
```
Este archivo será cargado por el `JsonLoaderStrategy`.

### 3. Implementar la Clase Seeder

En `src/core/application/services/seeding/seeders/`, crea `tu-entidad.seeder.ts`, extendiendo `AbstractSeeder`:
```ts
@Injectable()
export class TuEntidadSeeder
  extends AbstractSeeder<TuEntidadEntity, I<Entidad>Seed>
  implements ISeeder
{
  constructor(
    @Inject(MYSQL_REPOSITORY.TU_ENTIDAD)
    repository: Repository<TuEntidadEntity>,
    @Inject(DATA_LOADER.JSON)
    protected jsonLoader: IDataLoader,
  ) { super(repository); }

  protected async alreadySeeded(): Promise<boolean> {
    return (await this.repository.count()) > 0;
  }

  protected async getSeeds(): Promise<I<Entidad>Seed[]> {
    return this.jsonLoader.load<I<Entidad>Seed>('tu-entidad-seeds.json');
  }

  protected async transform(seeds: I<Entidad>Seed[]): Promise<TuEntidadEntity[]> {
    return seeds.map(seed => this.repository.create({
      campo1: seed.campo1,
      campo2: seed.campo2,
    }));
  }
}
```

### 4. Añadir el Provider del Repositorio

En `repository-entities.providers.ts`, registra el repositorio de TypeORM:
```ts
{
  provide: MYSQL_REPOSITORY.TU_ENTIDAD,
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(TuEntidadEntity),
  inject: [DATA_SOURCE.MYSQL],
},
```

### 5. Registrar el Seeder

En `seeder.providers.ts`, importa y añade tu `TuEntidadSeeder`:
```ts
import { TuEntidadSeeder } from 'src/core/application/services/seeding/seeders/tu-entidad.seeder';

export const seederProviders = [
  // ... otros seeders
  TuEntidadSeeder,
];
```

### 6. Ejecutar el Seeder

Ejecuta tu comando de seed (según tu setup, p.ej.):
```bash
npm run seed
# o
yarn seed:run
```

El flujo hará:
1. Comprobar si `alreadySeeded()` devuelve `true`.
2. Cargar JSON con `getSeeds()`.
3. Transformar a Entities con `transform()`.
4. Insertar en la base de datos.

---

## 📝 Buenas Prácticas & Consideraciones

- **Orden de Seeders**: Respeta dependencias (e.g., estados antes de reservas).
- **Idempotencia**: `alreadySeeded()` previene duplicados.
- **Validación JSON**: Asegúrate que los campos en JSON coincidan exactamente con tu Entity.
- **Logging**: Agrega logs en `AbstractSeeder` si necesitas trazabilidad.
- **Testing**: Crea tests de integración para validar que los seeds se cargan correctamente.

---

Con esta guía tendrás un flujo estandarizado y profesional para añadir cualquier *seeder* a tu proyecto. ¡Éxitos! 🎉

