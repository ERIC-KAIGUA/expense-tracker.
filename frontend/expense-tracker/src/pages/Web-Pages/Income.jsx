import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Barchart from "../../components/Barchart";
import { IoDownloadOutline } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { GoTrash } from "react-icons/go";
import { AiOutlineRise } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import IncomeForm from "../../forms/IncomeForm";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import EmojiPicker from 'emoji-picker-react';
import IncomeCard from "../../components/IncomeCard";

 
const notify = () =>toast('Downloaded Successfully!')
  const inform=()=>toast('Item Deleted Successfully!')

    const Income = () =>{
   const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
   const closeModal = () => setIsModalOpen(false);
   const [incomes, setIncomes] = useState([]);
  const [chartData, setChartData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
                 const toggleNav = () => {
                   setIsOpen(!isOpen);
               };
    

 
  const fetchIncomes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found, cannot fetch incomes.");
      return;
    }

    try {
      const response = await fetch('https://expense-tracker-fdez.onrender.com', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched incomes:", data);
        setIncomes(data);
          const newChartData = data.map(income => {
          const date = new Date(income.date);
          const monthDay = date.toLocaleString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
          return {
            name: monthDay,
            amt: income.amount,
          };
        });
        setChartData(newChartData.reverse());
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch incomes:', errorData);
      }
    } catch (error) {
      console.error('Network or server error fetching incomes:', error);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleDownloadExcel = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to download the Excel file!');
      return;
    }

    const response = await fetch('https://expense-tracker-fdez.onrender.com', {
      method: 'GET',
      headers:{
          'Content-Type': 'application/json',
          'x-auth-token':`${token}`,
        },
    });

    if (response.ok) {
      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'income_details.xlsx'; // Default filename
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

      console.log('Income Excel downloaded successfully!');
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


   const handleDeleteIncome = async(idToDelete) => {
    console.log(`${idToDelete}`)
    try{ 
      const token = localStorage.getItem('token');
      if(!token){
        alert('You must be logged in to add income!');
        return;
      }
       console.log(`Attempting to delete income with ID: ${idToDelete}`);
      const response = await fetch(`https://expense-tracker-fdez.onrender.com/${idToDelete}`,{
        method:'DELETE',
        headers:{
          'Content-Type': 'application/json',
          'x-auth-token':`${token}`,
        },
       });
  
    if(response.ok){
      setIncomes((prevIncomes) => prevIncomes.filter((income) => income._id !== idToDelete));
      console.log("Income Deleted Successfully!")
      setChartData((prevChartData) =>
      prevChartData.filter((bar) => {
            const deletedIncome = incomes.find((income) => income._id === idToDelete);
            if (!deletedIncome) return true;
            const date = new Date(deletedIncome.date);
            const monthDay = date
              .toLocaleString("en-US", { month: "short", day: "numeric" })
              .toUpperCase();
            return !(bar.name === monthDay && bar.amt === deletedIncome.amount);
          })
        );
        inform();
    }else{
                const errorData = await response.json();
                console.error("Something Went Wrong!", errorData);
                alert(`Error deleting income: ${errorData.msg || 'Unknown error'}`);
    }   
    }catch(err){
      console.error('Network or server error:', err);
    }
  
   }
   const handleAddIncome = async (newIncome) => {
    try{ 
      const token = localStorage.getItem('token');
      if(!token){
        alert('You must be logged in to add income!');
        return;
      }
      console.log('New income data:', newIncome);
      const response = await fetch('https://expense-tracker-fdez.onrender.com',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
          'x-auth-token':`${token}`,
        },
        body: JSON.stringify({
        source: newIncome.source,
        amount: newIncome.amount,
        date: newIncome.date,
      }),
      });
      console.log(`The new income is: ${newIncome}`)
     
    if(response.ok){
       const addedIncome = await response.json();
      console.log("Income added Successfully!",addedIncome)
      setIncomes((prevIncomes) => [...prevIncomes, addedIncome]);
      const date = new Date(addedIncome.date);
        const monthDay = date
          .toLocaleString("en-US", { month: "short", day: "numeric" })
          .toUpperCase();
        const newChartBar = {
          name: monthDay,
          amt: addedIncome.amount,
        };
        setChartData((prevChartData) => [...prevChartData, newChartBar].reverse());
      await fetchIncomes();
        closeModal();
    }else{
      console.error("Something Went Wrong!")
    }   
    }catch(err){
      console.error('Network or server error:', err);
    }
     
  };
  
    return(
        <div className="income-container">
            <button className="hamburger" onClick={toggleNav}><RxHamburgerMenu /></button>
                       <div className={`sidenav ${isOpen ? 'open' : ''}`}>
                    <h3>Main Menu</h3>
                    <Sidebar />
             </div>

             <div className="dashboard-right">
                   <div className="graph">
                    <Barchart data={chartData}></Barchart>  
                    <button id="add-income-btn" onClick={openModal}><CiSquarePlus className="add-icon" />Add-Income</button> 
                   </div>
                 <div className="grid-template">
                    <div className="header-element">
                                    <p>Income Sources</p>
                                    <button id="download-btn" onClick={handleDownloadExcel}> <IoDownloadOutline className="download-icon" />Download</button>
                    </div>
                    <div className="main-content">  
                        {incomes.map(income => {
                                          const date = new Date(income.date);
                                          const year = date.getFullYear();
                                          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                                          const day = String(date.getDate()).padStart(2, '0');
                                          const formattedDate = `${year}/${month}/${day}`;

                                          return (
                                            <IncomeCard
                                              key={income._id}
                                              id={income._id}
                                              source={income.source}
                                              date={formattedDate} 
                                              amount={income.amount}
                                              onDelete={handleDeleteIncome}
                                            />
                                          );
                                        })}
                    </div>                   
                </div>
              </div>
              <Modal isOpen={isModalOpen} onClose={closeModal}>
                
                <IncomeForm closeModal={closeModal}  onAddIncome={handleAddIncome}  /> 
            </Modal>
         </div>
    )
}
export default Income
