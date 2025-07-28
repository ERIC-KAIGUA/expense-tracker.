import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    icon:{
        type:mongoose.Schema.Types.String
    },
    category:{
        type:mongoose.Schema.Types.String,
        required:true
    },
    amount:{
        type:mongoose.Schema.Types.Number,
        required:true
    },
    date:{
        type:mongoose.Schema.Types.Date,
        default:Date.now
    }
},{timestamps:true});

export const Expense = mongoose.model("Expense",expenseSchema)