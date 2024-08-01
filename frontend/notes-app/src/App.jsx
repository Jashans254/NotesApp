import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Welcome from './pages/Welcome/Welcome'

const routes = (
  <Router>
    <Routes>
      <Route path='/dashboard' exact element={<Home />} />
      <Route path='/login' exact element={<Login />} />
      <Route path='/signup' exact element={<SignUp/>} />
      <Route path='/' exact element={<Welcome />} />
    </Routes>
  </Router>
)
const App = () => {
  
  return (
   <>
   {routes}
   
   </>
  )
}

export default App