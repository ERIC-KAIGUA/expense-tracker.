import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
 import { FaEyeSlash } from "react-icons/fa";

const Input = ({type, placeholder,name,value,onChange}) => {
    const [showPassword, setShowPassword] = useState(false)
      const toggleShowPassword = () => {
        setShowPassword(!showPassword)
      }
      return(
         <div>
           <input
        name={name}
        type={type === "password" && showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value} // ✨ Ensure value is also passed
        onChange={onChange} // ✨ Pass the onChange prop to the internal input
      />
            {type === "password" && (
                <>
                {showPassword ?(
                    <FaEye 
                size={22}
                className="eye"
                onClick={() => toggleShowPassword()}
                />
                ) : (
                    <FaEyeSlash 
                    size={22}
                    className="eye"
                    onClick={() => toggleShowPassword()}
                    />
                )
            }
                </>
            )}
         </div>
      )
    }
export default Input