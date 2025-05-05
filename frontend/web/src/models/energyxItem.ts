export enum energyxItemState {
    energyx = "energyx",
    InProgress = "inprogress",
    Done = "done"
}

export interface energyxItem {
    id?: string
    listId: string
    name: string
    state: energyxItemState
    description?: string
    dueDate?: Date
    completedDate?:Date
    createdDate?: Date
    updatedDate?: Date
}