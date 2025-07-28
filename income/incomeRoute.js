import { Router } from "express";
import mongoose from "mongoose";
import xlsx from 'xlsx';
import { User } from "../user/userSchema.js";
import { Income } from "./incomeSchema.js";
import authMiddleware from "../middleware/authMiddleware.js";



const router = Router();
router.post('/add-income',authMiddleware, async(req,res)=>{
    const userId = req.user.id;

    try{
        const { source, amount, date,icon } = req.body;


        if(!source || !amount || !date){
            res.status(401).json({msg:"All fields are required"})
        }
      const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date
        })
        await newIncome.save()
        return res.json({msg:"Income added successfully"})
    }catch(err){
        console.log({msg:`${err}`})
    }
})

router.get('/getAllIncome',authMiddleware,async(req,res)=>{
    const userId = req.user.id;
    try{
        const income= await Income.find({userId}).sort({date:-1});
         res.json(income)
    }catch(err){
        console.log({msg:`${err}`})
    }
})
router.delete('/delete-income/:id',authMiddleware, async(req,res)=>{
    try{
         const incomeId = req.params.id         
         
         
        //  .startsWith(':') ? req.params.id.substring(1) : req.params.id;

        console.log("Attempting to delete income with ID:", incomeId);

       
        if (!mongoose.Types.ObjectId.isValid(incomeId)) {
            return res.status(400).json({ msg: "Invalid Income ID format." });
        }

        const deletedIncome = await Income.findByIdAndDelete(incomeId);

        if (!deletedIncome) {
            return res.status(404).json({ msg: "Income not found." });
        }
        // await Income.findByIdAndDelete(req.params.id);
        res.json({msg:"Income deleted successfully"})
       
    }catch(err){
        console.log({msg:`${err}`})
    }
})
router.get('/downloadIncomeExcel',authMiddleware, async(req,res)=>{
    const userId = req.user.id;

    try{ 
        const income = await Income.find({userId}).sort({date:-1})

        //prepare data for excel
        const data = income.map((item)=>({
            Source:item.source,
            Amount: item.amount,
            Date: item.date
        }))
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws, "Income");
        xlsx.writeFile(wb, 'income_details.xlsx');
        res.download('income_details.xlsx');
    }catch(err){
        console.log({msg:`${err}`})
    }

})
export default router