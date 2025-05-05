export enum EnergyxItemState {
    energyx = "energyx",
    InProgress = "inprogress",
    Done = "done"
}

export interface EnergyxItem {
    id?: string
    listId: string
    name: string
    state: EnergyxItemState
    description?: string
    dueDate?: Date
    completedDate?:Date
    createdDate?: Date
    updatedDate?: Date
}