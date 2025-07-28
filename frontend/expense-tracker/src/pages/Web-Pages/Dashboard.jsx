import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { GiReceiveMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
import { BsWallet2 } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaLongArrowAltRight } from "react-icons/fa";
import Piechart from "../../components/Piechart";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
    const toggleNav = () => {
      setIsOpen(!isOpen);
  };
       const [summaryData, setSummaryData] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
  });
     const [transactions, setTransactions] = useState([]);
     const [statusMessage, setStatusMessage] = useState('');
     const [recentTransactions, setRecentTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
 
  const [error, setError] = useState(null);
 
   
  useEffect(() => {
    // Define an asynchronous function to fetch the data
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token')
        if(!token){
            alert("You have not logged in yet!");
            return;
        }
        const response = await fetch('http://localhost:3000/dashboard',{
            method:'GET',
            headers:{
                'Content-Type': 'application.json',
                'x-auth-token':`${token}`
            }
        });

        // Check if the network response was successful (status code 200-299)
        if (!response.ok) {
          // If the response is not OK, throw an error with the status
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
         const data = await response.json();
         setSummaryData({
          totalBalance: data.totalBalance || 0,
          totalIncome: data.totalIncome || 0,
          totalExpense: data.totalExpense || 0,
        });
        setRecentTransactions(data.recentTransactions || []);
          setTransactions(data.recentTransaction);
        } catch (err) {
        setError(`Failed to fetch transactions: ${err.message}. Please try again.`);
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
     }, []);
  
    return(
        <div className="dashboard-contaner">
            <button className="hamburger" onClick={toggleNav}><RxHamburgerMenu /></button>
            <div className={`sidenav ${isOpen ? 'open' : ''}`}>
                    <h3>Main Menu</h3>
                    <Sidebar />
             </div>

             <div className="dashboard-right">
                   <div className="cards">
                       <div className="card-1">
                        <div className="Icon">
                          <BsWallet2  className="wallet" />
                          </div>
                          <div className="summary-data">
                          <p>Total Balance</p>
                          <h3>${summaryData.totalBalance}</h3>
                          </div>
                       </div>
                       <div className="card-1">
                        <div className="Icon-2">
                          <GiReceiveMoney  className="wallet" />
                          </div>
                          <div className="summary-data">
                          <p>Total Income</p>
                          <h3> ${summaryData.totalIncome}</h3>
                          </div>
                       </div>
                       <div className="card-1">
                        <div className="Icon-3">
                          <GiPayMoney className="wallet" />
                          </div>
                          <div className="summary-data">
                          <p>Total Expenses</p>
                          <h3> ${summaryData.totalExpense}</h3>
                          </div>
                       </div>
                   </div>


                     <div className="sections">
                       <div className="section">
                            <h3>Financial Overview</h3>
                            <div className= "pie-chart">
                                    <Piechart className="piechart"summaryData={summaryData}></Piechart>
                               
                            </div>
                        </div>



                        <div className="section">
                            <h3>Recent Transactions</h3>
                        {statusMessage ? (
                                  <p className="error-message">{statusMessage}</p>
                                ) : recentTransactions.length < 0 ? (
                                //   recentTransactions.map(tx => (
                                //     <div className="transaction" key={tx.id}>
                                //       <p>{tx.title} <span className={tx.amount < 0 ? "negative" : "positive"}>{tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount)}</span></p>
                                //     </div>
                                //   ))
                                // ) :
                                    
                                  <p>No transactions available</p> 
                                ):(<div className="transaction-list">
                            {transactions.map((transaction)=>{
                                const displayName = transaction.type === 'expense' ? transaction.category : transaction.source;
                                const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
                                    month:"short",
                                    day:"numeric",
                                    year: "numeric"
                                                                    });
                                                                    const isExpense = transaction.type === 'expense';
                                            const circleColorClass = isExpense ? 'expense' : 'income'; // Use CSS class names
                                            const amountColorClass = isExpense ? 'expense' : 'income'; // Use CSS class names
                                            const amountSign = isExpense ? '-' : '+';
                                            const icon = isExpense ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-2.72 2.72a.75.75 0 1 0 1.06 1.06L12 13.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L13.06 12l2.72-2.72a.75.75 0 1 0-1.06-1.06L12 10.94l-2.72-2.72Z" clipRule="evenodd" />
                                                    </svg>) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                                </svg>
                                            );
                                            return (
                                            <div
                                                key={transaction._id} 
                                                className="transaction-item"
                                            >
                                                {/* Circle indicator */}
                                                <div className={`circle-indicator ${circleColorClass}`}></div>

                                                {/* Transaction details */}
                                                <div className="transaction-details">
                                                <p className="transaction-name">{displayName}</p>
                                                <p className="transaction-date">{formattedDate}</p>
                                                </div>

                                               
                                               

                                                {/* Amount display */}
                                                <div className={`amount-display ${amountColorClass}`}>
                                                <span>{amountSign}{transaction.amount.toLocaleString()}</span>
                                                {icon}
                                                </div>
                                            </div>
                                            );
                                        })}
                                        </div>)}
                         
                                   </div>
                                   </div>
                      
                    </div>
                  
                </div>
           
    )
}
export default Dashboard