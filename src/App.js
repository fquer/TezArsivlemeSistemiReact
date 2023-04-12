import './App.css';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';


function App() {
  
  // route ekle
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route exact path='/register' Component={Register}></Route>
          <Route exact path='/' Component={Home}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
