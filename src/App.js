import './App.css';
import React, { useState, useEffect } from "react";
import Navbar from './layout/Navbar';
import Register from './pages/Register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import ThesisUpload from './pages/ThesisUpload';
import ThesisUser from './pages/ThesisUser';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('userID') !== "" ? true : false)
  },[])

  return (
    <div>
      <BrowserRouter>
      <Navbar isLoggedIn = {isLoggedIn}/>
        <Routes>
          <Route exact path='//thesis/upload' Component={ThesisUpload}></Route>
          <Route exact path='//thesis/mytheses' Component={ThesisUser}></Route>
          <Route exact path='/register' Component={Register}></Route>
          <Route exact path='/login' Component={(props) => <Login {...props} setIsLoggedIn={ setIsLoggedIn } />}></Route>
          <Route exact path='/logout' Component={(props) => <Logout {...props} setIsLoggedIn={ setIsLoggedIn } />}></Route>
          <Route exact path='/' Component={Home}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
