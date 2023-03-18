import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  category: string;
}

const categoriesSchema: Schema = new Schema({
  category: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ICategory>("Category", categoriesSchema);
