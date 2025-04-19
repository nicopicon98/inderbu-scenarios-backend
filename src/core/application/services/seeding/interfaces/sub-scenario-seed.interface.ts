export interface ISubScenarioSeed {
  name: string;
  scenarioName: string;
  hasCost: boolean;
  activityAreaName?: string;
  fieldSurfaceTypeName?: string;
  numberOfSpectators?: number;
  numberOfPlayers?: number;
  recommendations?: string;
}
