import { Request, Response, NextFunction } from "express"
import { UserPayload } from "../dto"
import { HandleAuthorization } from "../utilities"
import { Category, Todo, User } from "../models";
import { ChangeTaskCategoryRequestInputs, CreateTodoRequestInputs, UpdateTodoRequestInputs } from "../dto/Todo.dto";

export const CreateTask = async (req: Request, res: Response, next: NextFunction) =>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    } 

    const profile = await User.findById(user._id).populate("categories");
    if(!profile){
        return res.status(400).json({message: "Could not find User"});
    }

    const requestData = <CreateTodoRequestInputs>req.body;
    const category = (!requestData.categoryId)? profile.categories.find((category)=> category.default == true): (profile.categories.find((category) => category.id == requestData.categoryId?.toLowerCase()));
    const createdTask = await Todo.create(
        {
            userId: profile.id,
            title: requestData.title,
            description: requestData.description,
            dueDate: requestData.dueDate,
            category: category,
            completed: false
        }
    );
    if(!createdTask){
        return res.status(400).json({message: "Could not create Task"});
    }

    profile.todos.push(createdTask);
    const savedProfile = await profile.save();
    if(!savedProfile){
        await createdTask.deleteOne();
        return res.status(400).json({message: "Could not create Task"});
    }
    return res.status(200).json(createdTask);
}

export const UpdateTask = async (req: Request, res: Response, next: NextFunction) =>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    } 

    const profile = await User.findById(user._id).populate("categories");
    if(!profile){
        return res.status(400).json({message: "Could not find User"});
    }

    const taskId = req.params.id;
    const task = await Todo.findById(taskId)
    if(!task){
        return res.status(404).json({message: "Task not Found"})
    }

    const requestData = <UpdateTodoRequestInputs>req.body;
    task.title = requestData.title;
    task.description = requestData.description;
    task.dueDate = requestData.dueDate;

    const updatedTask = await task.save();
    if(!updatedTask){
        return res.status(400).json({message: "Could not update Task"});
    }

    return res.status(200).json(updatedTask);
}

export const DeleteTask = async (req: Request, res: Response, next: NextFunction) =>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    } 

    const profile = await User.findById(user._id).populate("categories");
    if(!profile){
        return res.status(400).json({message: "Could not find User"});
    }

    const taskId = req.params.id;
    const task = await Todo.findById(taskId)
    if(!task){
        return res.status(404).json({message: "Task not Found"})
    }

    const deleted = task.deleteOne();
    if(!deleted){
        return res.status(400).json({message: "Could not delet task"});
    }
    return res.status(200).json({message: "Task deleted successfully."});
}

export const MarkAsComplete = async (req: Request, res: Response, next: NextFunction) =>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    } 

    const profile = await User.findById(user._id).populate("categories");
    if(!profile){
        return res.status(400).json({message: "Could not find User"});
    }

    const taskId = req.params.id;
    const task = await Todo.findById(taskId)
    if(!task){
        return res.status(404).json({message: "Task not Found"})
    }

    task.completed = true;
    const savedTask = await task.save();
    if(!savedTask){
        return res.status(400).json({message: "Could not update Task"});
    }
    return res.status(201).json(savedTask);
}

export const GetTasksByCategory = async (req: Request, res: Response, next: NextFunction) =>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    } 

    const profile = await User.findById(user._id).populate("todos");
    if(!profile){
        return res.status(400).json({message: "Could not find User"});
    }

    const categoryId:string = req.query.categoryId as string;
    if(!categoryId){
        return res.status(400).json({ message: 'categoryId is missing in the query parameters.' });
    }
    const tasks = await Todo.find({category: categoryId.toLowerCase()});
    return res.status(200).json(tasks);
}

export const ChangeTaskCategory = async (req: Request, res: Response, next: NextFunction) =>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    } 

    const profile = await User.findById(user._id).populate("todos");
    if(!profile){
        return res.status(400).json({message: "Could not find User"});
    }

    const taskId:string = req.params.taskId as string;
    const requestData = <ChangeTaskCategoryRequestInputs>req.body

    if(!taskId || !requestData.categoryId){
        return res.status(400).json({ message: 'TaskId and categoryId are required in the request' })
    }

    const category = await Category.findById(requestData.categoryId);
    if(!category){
        return res.status(404).json({message: "Category not found"});
    }

    const task = await Todo.findById(taskId);
    if(!task){
        return res.status(404).json({message: "Task not found"});
    }

    task.category = category;
    const savedTask = await task.save();

    if(!savedTask){
        return res.status(400).json({ message: 'Could not change task category' });
    }

    return res.status(200).json(savedTask);
}