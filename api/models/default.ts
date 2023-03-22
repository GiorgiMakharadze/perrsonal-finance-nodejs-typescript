import mongoose, { Document, Schema } from "mongoose";

export interface IDefault extends Document {
  name: string;
  description: string;
  category: string;
  type: string;
  amount: number;
  status: string;
}

const defaultsSchema: Schema = new Schema({
  name: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "outgoing"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    required: true,
  },
});

export default mongoose.model<IDefault>("Default", defaultsSchema);
