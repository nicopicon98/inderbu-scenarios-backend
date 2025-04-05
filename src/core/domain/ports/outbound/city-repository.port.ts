import { CityDomain } from "../../entities/cedi.entity";

export interface ICityRepositoryPort{
    findById(id: number): Promise<CityDomain | null>;
}