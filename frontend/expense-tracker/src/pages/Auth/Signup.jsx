import React from "react";
import Authlayout from "../../components/Authlayout";
import { useNavigate } from 'react-router-dom'
import { useState } from "react";


const Signup = () => {
     const [formData, setFormData] = useState({
            fullName:'',
            email: '',
            password: ''
        });
        const [error, setError] = useState('');
        const navigate = useNavigate(); // Hook for navigation
        const { fullName, email, password } = formData;
    
        const onChange = e => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
            setError(''); 
        };
    
        const onSubmit = async e => {
            e.preventDefault();
    
            try {
                const response = await fetch('https://expense-tracker-fdez.onrender.com', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fullName,email, password })
                });
    
                const data = await response.json();
    
                if (response.ok) { 
                    console.log('SignUp successful!',data);
                    
                    navigate('/Login'); 
                } else {
                    setError(data.msg || 'SignUp failed. Please check your credentials.');
                    console.error('SignUp error:', data);
                }
            } catch (err) {

                console.error('Network or server error:', err);
                setError('An error occurred. Please try again later.');
            }
        };
     
    return(
        <div className="signup-container">
            <div className="signup-left ">
               <h3>EXPENSE <span>TRACKER</span></h3>
                    <div className="create-account">
                        <h4>Create An Account</h4>
                        <p id="text">Join Us Today By Entering Your Details</p>
                    </div>
                    <form className="signup-form" onSubmit={onSubmit}>
                        <div className="flex-box">
                            <div className="input-field">
                                <h5 className="fullname-label">FullName</h5>
                                <input type="text" placeholder="FullName" id="fullName" name="fullName"required onChange={onChange}></input>
                            </div>
                          <div className="input-field">
                                <h5 className="email-label">Email</h5>
                                <input type="email" id="email" placeholder="john@example.com" name="email" required onChange={onChange}></input>
                            </div>
                       </div>
                       <div className="input-field">
                                <h5 className="password-label">Password</h5>
                                <input type="password" id="password"placeholder="Password" name="password" required onChange={onChange}></input><br></br>
                       </div>
                       <button type="submit" id="signin-button">Sign-Up</button>
                       <p>Already have an account? <a href={'/'}>Login</a></p>
                    </form>
            </div>
             <div className="signup-right">
                     <Authlayout>

                     </Authlayout>
                    </div>
        </div>
    )
}
export default Signup