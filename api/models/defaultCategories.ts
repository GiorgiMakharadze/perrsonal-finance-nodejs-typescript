import mongoose, { Document, Schema } from "mongoose";

export interface IDefaultCategory extends Document {
  name: string;
}

const defaultCategoriesSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IDefaultCategory>(
  "DefaultCategory",
  defaultCategoriesSchema
);
