import React from 'react'
import Register from './Pages/Register/Register'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login/Login'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </div>
  )
}

export default App
