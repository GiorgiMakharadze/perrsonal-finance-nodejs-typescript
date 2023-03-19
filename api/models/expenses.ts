import mongoose, { Schema } from "mongoose";

export interface IExpense extends mongoose.Document {
  description: string;
  type: "income" | "outgoing";
  amount: number;
  status?: "Processing" | "Completed";
  category: Schema.Types.ObjectId;
}

const ExpenseSchema = new Schema(
  {
    description: { type: String, required: true },
    type: { type: String, enum: ["income", "outgoing"], required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Processing", "Completed"],
      required: function (this: { type: string }) {
        return this.type === "outgoing";
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
