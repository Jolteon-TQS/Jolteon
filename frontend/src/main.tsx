import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Navbar from './components/Navbar'
import Home from './pages/home.tsx'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    {/* <App /> */}
    <Navbar />
    <Home />
    </BrowserRouter>
  </StrictMode>,
)