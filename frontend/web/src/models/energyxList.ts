import { EnergyxItem } from "./energyxItem";

export interface EnergyxList {
    id?: string
    name: string
    items?: EnergyxItem[]
    description?: string
    createdDate?: Date
    updatedDate?: Date
}