import React from "react"
import toast, { Toaster } from "react-hot-toast";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Signup from "./pages/Auth/Signup"
import Dashboard from "./pages/Web-Pages/Dashboard"
import Income from "./pages/Web-Pages/Income"
import Login from "./pages/Auth/Login"
import Expense from "./pages/Web-Pages/Expense"

function App() {
 
      return (
        <div>
          <Router>
            <Routes>
              <Route path="/" exact element={<Login/>}></Route>
               <Route path="/Signup" exact element={<Signup/>}></Route>
                <Route path="/Dashboard" exact element={<Dashboard/>}></Route>
                 <Route path="/Expense" exact element={<Expense/>}></Route>
                  <Route path="/Income" exact element={<Income/>}></Route>
            </Routes>
          </Router>
          <Toaster toastOptions={{
            className:'',
            duration:2000,
            style:{
              color:"green",
              fontSize:"12px",
               background: ' #96f9beff',
            }
          }}></Toaster>
        </div>
      )
}

export default App
