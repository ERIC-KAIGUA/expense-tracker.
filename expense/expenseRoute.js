import { Router } from "express";
import mongoose from "mongoose";
import xlsx from 'xlsx';
import { User } from "../user/userSchema.js";
import { Expense } from "./expenseSchema.js";
import authMiddleware from "../middleware/authMiddleware.js";



const router = Router();
router.post('/add-expense',authMiddleware, async(req,res)=>{
    const userId = req.user.id;

    try{
        const { category, amount, date, icon } = req.body;


        if(!category || !amount || !date){
            res.status(401).json({msg:"All fields are required"})
        }
      const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        })
        await newExpense.save()
        return res.json({msg:"Expense added successfully"})
    }catch(err){
        console.log({msg:`${err}`})
    }
})

router.get('/getAllExpenses',authMiddleware,async(req,res)=>{
    const userId = req.user.id;
    try{
        const expense = await Expense.find({userId}).sort({date:-1});
         res.json(expense)
    }catch(err){
        console.log({msg:`${err}`})
    }
})
router.delete('/delete-expense/:id',authMiddleware, async(req,res)=>{
   try{
         const expenseId = req.params.id         
                
        
                console.log("Attempting to delete expense with ID:", expenseId);
        
               
                if (!mongoose.Types.ObjectId.isValid(expenseId)) {
                    return res.status(400).json({ msg: "Invalid Expense ID format." });
                }
        
                const deletedExpense = await Expense.findByIdAndDelete(expenseId);
        
                if (!deletedExpense) {
                    return res.status(404).json({ msg: "Expense not found." });
                }
                // await Income.findByIdAndDelete(req.params.id);
                res.json({msg:"Expense deleted successfully"})
       
    }catch(err){
        console.log({msg:`${err}`})
    }
})
router.get('/downloadExpenseExcel',authMiddleware, async(req,res)=>{
    const userId = req.user.id;

    try{ 
        const expense = await Expense.find({userId}).sort({date:-1})

        //prepare data for excel
        const data = expense.map((item)=>({
            Category:item.category,
            Amount: item.amount,
            Date: item.date
        }))
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws, "Expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx');
    }catch(err){
        console.log({msg:`${err}`})
    }

})
export default router