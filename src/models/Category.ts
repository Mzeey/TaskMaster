import mongoose,{ Document, Schema } from "mongoose";

export interface CategoryDoc extends Document{
    userId: string;
    title: string;
    description: string;
    default: boolean;
}

const CategorySchema = new Schema(
    {
        userId: {type: Schema.Types.ObjectId, ref: "user"},
        title: {type: String, required: true},
        description: {type: String},
        default: {type: Boolean, default: false}
    },
    {
        toJSON: {
            transform(doc, ret){
                delete ret.__v;
				delete ret.createdAt;
				delete ret.updatedAt;
			}
        }, 
        timestamps: true
    }
);


const Category = mongoose.model<CategoryDoc>('categories', CategorySchema);

export {Category};