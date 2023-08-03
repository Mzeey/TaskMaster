
export interface AddTodoRequestInputs{
    title: string;
    description?: string;
    dueDate?: Date;
}

export interface UpdateTodoRequestInputs{
    title: string;
    description?: string;
    dueDate?: Date;
    taskComplete: boolean;
}