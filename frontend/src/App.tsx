import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import { Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Navbar here */}
      {/* <Routes>        
        <Route path="/"  element={<Home/>}/>
        <Route path="/restaurants"  element={<Restaurant/>}/>
        <Route path="/reservations"  element={<ReservationsPage/>}/>
      </Routes> */}

      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo h-24 p-2 will-change-transform hover:drop-shadow-[0_0_2em_#646cffaa] transition-all" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react h-24 p-2 will-change-transform hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin-slow" alt="React logo" />
          </a>
        </div>
        
        <h1 className="text-5xl font-bold mb-6 text-primary">
          Vite + React + <span className="text-secondary">DaisyUI</span>
        </h1>
        
        <div className="card bg-base-100 shadow-xl max-w-md mx-auto p-6 mb-6">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="btn btn-primary mb-4"
          >
            Count is {count}
          </button>
          <p className="text-base-content">
            Edit <code className="bg-neutral p-1 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>
        
        <p className="text-base-content/70">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
