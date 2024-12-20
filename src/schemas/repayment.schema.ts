import mongoose, { Schema } from "mongoose";

const repayment = new Schema({
  applicationId: {
    type: Schema.Types.ObjectId,
    ref: "Loan",
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  paymentAmount: {
    type: Number,
    required: true,
  },
  balanceRemaining: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Repayment = mongoose.model("Repayment", repayment);

export default Repayment;
