import mongoose, { Document, Schema } from "mongoose";
import { CategoryDoc } from "./Category";
export interface TodoDoc extends Document{
    userId: string;
    title: string;
    description?: string;
    category: CategoryDoc;
    dueDate?: Date;
    completed: boolean
}

const TodoSchema = new Schema(
    {
        userId: {type: String, required: true},
        title: {type: String, required: true},
        description: {type: String},
        category: {type: Schema.Types.ObjectId, ref: "categories", required: true},
        dueDate: {type: Date},
        completed: {type: Boolean, default: false}
    },
    {
        toJSON: {
            transform(doc, ret){
                delete ret.__v;
				delete ret.updatedAt;
            }
        },
        timestamps: true
    }
)

const Todo = mongoose.model<TodoDoc>('todo', TodoSchema);

export {Todo};