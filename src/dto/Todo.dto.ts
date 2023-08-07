
export interface CreateTodoRequestInputs{
    title: string;
    description?: string;
    dueDate?: Date;
    categoryId?: string
}

export interface UpdateTodoRequestInputs{
    title: string;
    description?: string;
    dueDate?: Date;
}

export interface ChangeTaskCategoryRequestInputs{
    categoryId:string
}