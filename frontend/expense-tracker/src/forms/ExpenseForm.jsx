import React,{ useState } from "react";
import toast from "react-hot-toast";

const notify =()=>toast('Expense Added Suceessfully!')
function ExpenseForm ({onCloseModal, onAddExpense }){
  const [category, setCategory] = useState('');
     const [amount, setAmount] = useState('');
     const [date, setDate] = useState('');
        
       const handleSubmit = (e) => {
        e.preventDefault();

         if (!category || !amount || !date) {
        alert('Please fill in all fields.');
        return;
    }
    const newExpense = {
      category: category,
      amount: parseFloat(amount),
      date: date,
    };

    onAddExpense(newExpense);

    setCategory('');
    setAmount('');
    setDate('');

    onCloseModal();
  };
    return(
           <div className="modal">
                <div className="modal-header">
                    <h3 className="modal-title">Add-Expense</h3>
                    <button className="close-btn" onClick={onCloseModal}>&times;</button>
                </div>
                <div className="modal-body">
                    <form id="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label for="Income">Category</label>
                                <input type="text" name="category" id="income" placeholder="Freelance,Salary,etc" value={category} onChange={(e) => setCategory(e.target.value)}required></input>
                            </div>
                            <div className="form-group">
                                <label for="Amount">Amount</label>
                                <input type="number" name="amount" id="amount" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)}required></input>
                            </div>
                            <div className="form-group">
                                <label for="Date">Date</label>
                                <input type="date" name="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required></input>
                            </div>
                        </div>
                    </form>
               </div>
            <div className="modal-footer">
              <button type="submit"id="add-income" form="contact-form" onClick={onCloseModal, notify}>Add Expense</button>
            </div>
          </div>
    )

}
export default ExpenseForm