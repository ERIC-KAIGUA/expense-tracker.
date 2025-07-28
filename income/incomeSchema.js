import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    icon:{
        type:mongoose.Schema.Types.String
    },
    source:{
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

export const Income = mongoose.model("Income",incomeSchema)