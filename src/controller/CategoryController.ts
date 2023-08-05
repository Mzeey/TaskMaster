import express, {Request, Response, NextFunction} from 'express';
import { UserPayload } from '../dto/User.dto';
import { Category, User } from '../models';
import { CreateCategoryRequestInputs } from '../dto';
import { HandleAuthorization } from '../utilities';

export const CreateCategory = async ( req:Request, res: Response, next:NextFunction )=>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    }
    
    const profile = await User.findById(user._id);
    if(!profile){
        return res.status(400).json({message: "User not found"});
    }

    const requestData = <CreateCategoryRequestInputs>req.body;
    const createdCategory = await Category.create({
        title: requestData.title,
        description: requestData.description,
        default: false
    });

    if(!createdCategory){
        return res.status(400).json({message: "Could not Create Category"});
    }

    profile.categories.push(createdCategory);
    const updatedProfile = await profile.save();
    if(!updatedProfile){
        createdCategory.deleteOne();
        return res.status(400).json({message: "Could not Create Category"});
    }
    return res.status(200).json(createdCategory);
}
export const GetCategories = async ( req:Request, res: Response, next:NextFunction )=>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    }
    
    const profile = await User.findById(user._id).populate('categories');
    if(!profile){
        return res.status(400).json({message: "User not found"});
    }

    return res.status(200).json(profile.categories);
}

export const GetCategoryById = async ( req:Request, res: Response, next:NextFunction )=>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    }
    
    const profile = await User.findById(user._id);
    if(!profile){
        return res.status(400).json({message: "User not found"});
    }

    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if(!category){
        return res.status(404).json({message: "Category not found"})
    }

    return res.status(200).json(category);
}

export const UpdateCategory = async ( req:Request, res: Response, next:NextFunction )=>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    }
    
    const profile = await User.findById(user._id);
    if(!profile){
        return res.status(400).json({message: "User not found"});
    }
    
    const categoryId = req.params.id;
    const requestData = <CreateCategoryRequestInputs> req.body;
    const requiredCategory = await Category.findById(categoryId.toLowerCase());
    if(!requiredCategory){
        return res.status(404).json({message: "Category not found"});
    }

    requiredCategory.title = requestData.title;
    requiredCategory.description = requestData.description || requiredCategory.description;
    
    const updatedCategory = await requiredCategory.save();
    if(!updatedCategory){
        return res.status(400).json({message: "Could not Update Category"});
    }

    return res.status(201).json(updatedCategory);
}

export const DeleteCategory = async ( req:Request, res: Response, next:NextFunction )=>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    }
    
    const profile = await User.findById(user._id);
    if(!profile){
        return res.status(400).json({message: "User not found"});
    }

    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if(!category){
        return res.status(404).json({message: "Category Not Found"});
    }
    if(category.default){
        return res.status(400).json({message: "Cannot Delete Default Category"});
    }
    
    const deleted = await category.deleteOne();
    if(deleted){
        return res.status(200).json({message: "Category deleted successfully."})
    }
    return res.status(400).json({message: "Could not delete Category"})
}
