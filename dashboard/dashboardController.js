import { Income } from "../income/incomeSchema.js";
import { Expense } from "../expense/expenseSchema.js"; 
import  {isValidObjectId,Types} from "mongoose";


//Dashboard Data
const getDashboardData = async(req,res)=>{
    try{
        const userId = req.user.id;
        console.log(`${userId}`)
        
        const userObjectId = new Types.ObjectId(String(userId));
        console.log(`${userObjectId}`)

         const sampleDoc = await Income.findOne({ userId: userObjectId });
        console.log("Sample Document:", sampleDoc);

        //Fetch Total Income & Expenses
        const totalIncome = await Income.aggregate([
               {$match: {userId: userObjectId}},
               {$group:{_id:null, total: {$sum:"$amount"}}}
        ]);
        console.log("Total Income:", totalIncome);
        console.log("totalIncome", {totalIncome, userId: isValidObjectId(userId)});
        
        const totalExpense = await Expense.aggregate([
            {$match:{ userId:userObjectId}},
            {$group:{_id:null,total:{$sum:"$amount"}}}
        ]);
         console.log("totalExpense", {totalExpense, userId: isValidObjectId(userId)});

         
        //get income transactions in the last 60 Days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: {$gte:new Date(Date.now() - 60*24*60*60*1000)}
        }).sort({date:-1});

        //get total Income for the last 60 days
        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum,transaction)=>sum+transaction.amount,
            0
        )
        //get expense transactions in the last 30 days
        const last30DaysExpenseTransactions =await Expense.find({
            userId,
            date: {$gte:new Date(Date.now()-30*24*60*60*1000)}
        }).sort({date:-1});

        //get total expenses for last 30 days
        const expensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum,transaction)=>sum+transaction.amount,
            0
        );
        //fetch last 5 transactions(income+expenses)
        const lastTransactions =[
            ...(await Income.find({userId}).sort({date:-1}).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type:"income",
                })
            ),
              ...(await Expense.find({userId}).sort({date:-1}).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type:"expense",
                })
            )
        ].sort((a,b)=> b.date-a.date);

        //Final Response
        res.json({
            totalBalance:
            (totalIncome[0]?.total || 0)-(totalExpense[0]?.total || 0),
            totalIncome:totalIncome[0]?.total|| 0,
            totalExpense:totalExpense[0]?.total||0,
            last30DaysExpense:{
                total:expensesLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome:{
                total:incomeLast60Days,
                transactions:last60DaysIncomeTransactions,
            },
            recentTransaction:lastTransactions,
        });
    }catch(err){
        res.status(500).json({msg:"Server Error", err});
    }
}
export default getDashboardData