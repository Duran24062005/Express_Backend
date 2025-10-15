import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { Header } from './components/Header.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}/>
        <Route path='/header' element={<Header/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
