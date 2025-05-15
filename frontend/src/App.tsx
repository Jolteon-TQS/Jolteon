// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home.tsx';
import Bikes from './pages/bikes';
import Routing from './pages/routes';
import Navbar from './components/Navbar.tsx';
import About from './pages/about.tsx';
import Login from './pages/login.tsx';

function App() {
  return (
    <>
      <Navbar/>
      <Routes>        
          <Route path="/"  element={<Home/>}/>
          <Route path="/bikes"  element={<Bikes/>}/>
          <Route path="/routes"  element={<Routing/>}/>
          <Route path="/about"  element={<About/>}/>
          <Route path="/login"  element={<Login/>}/>
      </Routes>
    </>
  );
}

export default App;
