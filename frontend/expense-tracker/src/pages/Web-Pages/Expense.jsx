import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Linechart from "../../components/Linechart";
import Modal from "../../components/Modal";
import ExpenseForm from "../../forms/ExpenseForm";
import toast from "react-hot-toast";
import { IoDownloadOutline } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { GoTrash } from "react-icons/go";
import { AiOutlineFall } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import ExpenseCard from "../../components/ExpenseCard";


const notify = () =>toast('Downloaded Successfully!')
const inform=()=>toast('Item Deleted Successfully!')


const Expense = () =>{
     const [isModalOpen, setIsModalOpen] = useState(false);
        const openModal = () => setIsModalOpen(true);
         const closeModal = () => setIsModalOpen(false);
           const [expenses, setExpenses] = useState([]);
           const [chartData, setChartData] = useState([]);
            const [isOpen, setIsOpen] = useState(false);
               const toggleNav = () => {
                 setIsOpen(!isOpen);
             };


  const fetchExpenses = async () => {
     const token = localStorage.getItem('token');
     if (!token) {
       console.log("No token found, cannot fetch Expenses.");
       return;
     }
 
     try {
       const response = await fetch('https://expense-tracker-ec7u.onrender.com/api/getAllExpenses', {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
           'x-auth-token': `${token}`,
         },
       });
 
       if (response.ok) {
         const data = await response.json();
         console.log("Fetched expenses:", data);
         setExpenses(data);
           const newChartData = data.map(expense => {
           const date = new Date(expense.date);
           const monthDay = date.toLocaleString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
           return {
             name: monthDay,
             amt: expense.amount,
           };
         });
         setChartData(newChartData.reverse());
       } else {
         const errorData = await response.json();
         console.error('Failed to fetch expenses:', errorData);
       }
     } catch (error) {
       console.error('Network or server error fetching expenses:', error);
     }
   };
 
   useEffect(() => {
     fetchExpenses();
   }, []);          
   
           

          
       
  const handleDownloadExcel = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to download the Excel file!');
      return;
    }

    const response = await fetch('https://expense-tracker-ec7u.onrender.com/api/downloadExpenseExcel', {
      method: 'GET',
      headers:{
          'Content-Type': 'application/json',
          'x-auth-token':`${token}`,
        },
    });

    if (response.ok) {
      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'expense_details.xlsx'; // Default filename
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Set the download filename
      document.body.appendChild(a);
      a.click(); // Programmatically click the link to trigger download
      a.remove(); // Clean up the temporary <a> element
      window.URL.revokeObjectURL(url); // Release the object URL

      console.log('Expense Excel downloaded successfully!');
      notify('Downloaded Successfully!')
    } else if (response.status === 401) {
      alert('Unauthorized: Please log in again.');
      console.error('Unauthorized to download Excel.');
    } else {
      console.error('Failed to download Excel:', response.statusText);
      alert('Failed to download Excel file. Please try again.');
    }
  } catch (error) {
    console.error('Network or server error during Excel download:', error);
    alert('An error occurred during download. Please check your network connection.');
  }
};







 const handleDeleteExpense = async(idToDelete) => {
            console.log(`${idToDelete}`)
    try{ 
      const token = localStorage.getItem('token');
      if(!token){
        alert('You must be logged in to add expense!');
        return;
      }
      console.log(`${token}`)
       console.log(`Attempting to delete expense with ID: ${idToDelete}`);
      const response = await fetch(`https://expense-tracker-ec7u.onrender.com/delete-expense/api/${idToDelete}`,{
        method:'DELETE',
        headers:{
          'Content-Type': 'application/json',
          'x-auth-token':`${token}`,
        },
       });
  
    if(response.ok){
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== idToDelete));
      console.log("Expense Deleted Successfully!")
      setChartData((prevChartData) =>
      prevChartData.filter((line) => {
            const deletedExpense = expenses.find((expense) => expense._id === idToDelete);
            if (!deletedExpense) return true;
            const date = new Date(deletedExpense.date);
            const monthDay = date
              .toLocaleString("en-US", { month: "short", day: "numeric" })
              .toUpperCase();
            return !(line.name === monthDay && line.amt === deletedExpense.amount);
          })
        );
        inform();
    }else{
                const errorData = await response.json();
                console.error("Something Went Wrong!", errorData);
                alert(`Error deleting expense: ${errorData.msg || 'Unknown error'}`);
    }   
    }catch(err){
      console.error('Network or server error:', err);
    }
                          };


 const handleAddExpense = async (newExpense) => {
            try{ 
      const token = localStorage.getItem('token');
      if(!token){
        alert('You must be logged in to add expense!');
        return;
      }
      
       console.log('New expense data:', newExpense);
      const response = await fetch('https://expense-tracker-ec7u.onrender.com/api/add-expense',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
          'x-auth-token':`${token}`,
        },
        body: JSON.stringify({
           category: newExpense.category,
           amount: newExpense.amount,
           date: newExpense.date,
        }),
        
      });
      console.log(`The new expense is: ${newExpense}`)

      
    if(response.ok){
       const addedExpense = await response.json();
      console.log("Income added Successfully!",addedExpense)
      setExpenses((prevExpenses) => [...prevExpenses, addedExpense]);
      const date = new Date(addedExpense.date);
        const monthDay = date
          .toLocaleString("en-US", { month: "short", day: "numeric" })
          .toUpperCase();
        const newChartBar = {
          name: monthDay,
          amt: addedExpense.amount,
        };
        setChartData((prevChartData) => [...prevChartData, newChartBar]);
      await fetchExpenses();
        closeModal();
    }else{
      console.error("Something Went Wrong!")
    }   
    }catch(err){
      console.error('Network or server error:', err);
    }
           };
        return(
        <div className="expense-container">
             <button className="hamburger" onClick={toggleNav}><RxHamburgerMenu /></button>
                        <div className={`sidenav ${isOpen ? 'open' : ''}`}>
                    <h3>Main Menu</h3>
                    <Sidebar />
             </div>

             <div className="dashboard-right">
                    <div className="graph">
                            {/* <h4>Income Chart</h4> */}
                            <Linechart className="mylinechart" data={chartData}></Linechart>
                             <button id="add-expense-btn" onClick={openModal}><CiSquarePlus className="add-icon" />Add-Expense</button> 
                    </div>
                    <div className="grid-template">
                                <div className="header-element">
                                    <p>Your Expenditure</p>
                                        <button id="download-btn" onClick={handleDownloadExcel}> <IoDownloadOutline className="download-icon" />Download</button>
                                 </div>
                                <div className="main-content">
                                    {expenses.map(expense => {
                                          const date = new Date(expense.date);
                                          const year = date.getFullYear();
                                          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                                          const day = String(date.getDate()).padStart(2, '0');
                                          const formattedDate = `${year}/${month}/${day}`;

                                          return (
                                            <ExpenseCard
                                              key={expense._id}
                                              id={expense._id}
                                              category={expense.category}
                                              date={formattedDate} // Pass the formatted date
                                              amount={expense.amount}
                                              onDelete={handleDeleteExpense}
                                            />
                                          );
                                        })}                  
                                </div>    
                    </div>
            </div>
                   <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ExpenseForm closeModal={closeModal} onAddExpense={handleAddExpense} /> 
            </Modal>
        </div>
    )
}
export default Expense