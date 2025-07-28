import React from "react";
import { GoTrash } from "react-icons/go";
import { AiOutlineFall } from "react-icons/ai";



const ExpenseCard = ({id,category,date,amount,onDelete}) =>{
    
    return(
          <div className="element-wrapper">
                                               <div className="income-icon"></div>
                                                <div className="text-1">
                                                   <p className="salary">{category}</p>
                                                  <p className="date">{date}</p>
                                              </div>
                                               <button id={`delete-btn-${id}`} className="delete-btn" onClick={() => onDelete(id)} ><GoTrash className="trash-icon"/></button> 
                                              <div className="spend-2">
                                              <p className="spending-text">-{amount}</p>
                                               <AiOutlineFall className="fall" />
                                              </div>
                                             </div>   
    )

}
export default ExpenseCard