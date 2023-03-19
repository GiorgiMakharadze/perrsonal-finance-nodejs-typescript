import mongoose, { Document, Schema } from "mongoose";

export interface IDefault extends Document {
  name: string;
}

const defaultsSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IDefault>("Default", defaultsSchema);
