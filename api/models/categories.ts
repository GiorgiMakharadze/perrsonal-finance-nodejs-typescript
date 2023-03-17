import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  category: string;
  default: string;
}

const categoriesSchema: Schema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  category: {
    type: String,
    required: true,
    unique: true,
  },
  // type: {
  //   type: String,
  //   default: "default",
  // },
});

export default mongoose.model<ICategory>("Category", categoriesSchema);
