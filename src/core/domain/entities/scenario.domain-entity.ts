export class ScenarioDomainEntity {
  constructor(
    readonly id: number | null,
    readonly name: string,
    readonly address: string,
  ) {}
}
