import React from "react";
import { GoTrash } from "react-icons/go";
import { AiOutlineRise } from "react-icons/ai";

const IncomeCard = ({id, source, date, amount, onDelete}) =>{
    
    return(
          <div className="element-wrapper">
                                         <div className="income-icon"></div>
                                         <div className="text-1">
                                            <p className="salary">{source}</p>
                                            <p className="date">{date}</p>
                                         </div>
                                        <button id={`delete-btn-${id}`} className="delete-btn"
                                         onClick={() => onDelete(id)}><GoTrash className="trash-icon"/></button> 
                                         <div className="text-2">
                                            <p className="cash-text">+{amount}</p>
                                            <AiOutlineRise className="rise" />
                                         </div>
                                    </div>
    )

}
export default IncomeCard