import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  defaultCategory: boolean;
}

const categoriesSchema: Schema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true,
  },
  defaultCategory: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.model<ICategory>("Category", categoriesSchema);
