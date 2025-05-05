import { energyxItem } from "./energyxItem";

export interface energyxList {
    id?: string
    name: string
    items?: energyxItem[]
    description?: string
    createdDate?: Date
    updatedDate?: Date
}