import React, { useState } from "react";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BsBank } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
   
      const navItems = [
            { name: 'Dashboard', path: "/Dashboard", icon: <MdOutlineSpaceDashboard /> },
            { name: 'Expense',  path: "/Expense", icon: <FaWallet /> }, 
            { name: 'Income', path: "/Income", icon:  <BsBank /> },
            { name: 'Logout', path: "/", icon: <IoLogOutOutline />},
      ];

    
    return(
          <div className="links">
          
           <ul className="navlinks">
                              {navItems.map((item) => (
                        <li key={item.name}>
                                <Link to={item.path}
                                      id={`${item.name.toLowerCase()}-link`}
                                      className={`side-icon ${location.pathname === item.path ? 'active' : ''}`}
                                 >
                                      {item.icon} {item.name}
                                </Link>
                              
                        </li>
                      ))}
           </ul>

      </div>
  );
};
   
export default Sidebar











