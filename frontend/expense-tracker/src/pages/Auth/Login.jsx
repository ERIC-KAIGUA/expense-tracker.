import React from "react";
import Input from "../../components/Input";
import Signup from "./Signup";
import Authlayout from "../../components/Authlayout";
import { useNavigate } from 'react-router-dom'
import { useState } from "react";


const Login = () =>{
     const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation


    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); 
    };

    const onSubmit = async e => {
        e.preventDefault();

     const { email, password } = formData;
      console.log('=== FRONTEND DEBUG ===');
    console.log('Email value:', email);
    console.log('Password value:', password ? 'PROVIDED' : 'EMPTY');
    console.log('FormData state:', formData);
    console.log('Sending request body:', { email, password: password ? 'PROVIDED' : 'EMPTY' });
    
    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

        try {
            const response = await fetch('https://expense-tracker-ec7u.onrender.com', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

             const data = await response.json();
             console.log('Full response data:', data);
    console.log('data.token:', data.token);
    console.log('data.msg:', data.msg);

    console.log('Possible token locations:');
    console.log('- data.token:', data.token);
    console.log('- data.Token:', data.Token);
    console.log('- data.JWT:', data.JWT);
    console.log('- data.accessToken:', data.accessToken)

            if (response.ok) { // Check if the response status is 2xx (success)
                // Backend successfully sent a token
                localStorage.setItem('token', data.token); // Store the token in localStorage
 console.log('Login successful! Token:', data.token);
                console.log('Login successful! Token:', data.token);
                // Redirect user to a protected page or dashboard
                navigate('/Dashboard'); // Change to your desired post-login route
            } else {
               
                setError(data.msg || 'Login failed. Please check your credentials.');
                console.error('Login error:', data);
            }
        } catch (err) {
           
            console.error('Network or server error:', err);
            setError('An error occurred. Please try again later.');
        }
    };
 
    return(
        <div className="login-container">
                <div className="login-left">
                    <h3>EXPENSE <span>TRACKER</span></h3>
                    <div className="welcome">
                    <h4>WELCOME BACK</h4>
                    <p id="text">Please Enter Your Details to Log In</p>
                    <form onSubmit={onSubmit}>
                        <h5 className="email-label">Email</h5>
                        <input type="email" name="email" value={formData.email} placeholder="john@example.com" required onChange={onChange}></input><br></br>
                        <h5 className="password-label">Password</h5>
                        <Input type="password" name="password" value={formData.password} placeholder="Password"  required onChange={onChange}></Input>
                        <button type="submit" id="login">Login</button>
                        <p>Dont have an account? <a href={'/Signup'} >Sign-Up</a></p>
                    </form>
                    </div>
                </div>
                <div className="login-right">
                <Authlayout>
               </Authlayout>
                </div>
        </div>
    )
}
export default Login

