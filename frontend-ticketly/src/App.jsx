import React from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/customer/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { AuthProvider } from './context/AuthContext'
import BusList from './pages/customer/BusList'
import SeatSelection from './pages/customer/SeatSelection'
import BookingProcess from './pages/customer/BookingProcess'
import Payment from './pages/customer/Payment'
import PaymentStatus from './pages/customer/PaymentStatus'
import MyBookings from './pages/customer/MyBookings'
import Wallet from './pages/customer/Wallet'

const App = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/buslist" element={<BusList />}/>
      <Route path="/seat-selection" element={<SeatSelection />}/>
      <Route path="/booking-process" element={<BookingProcess />}/>
      <Route path="/payment" element={<Payment />}/>
      <Route path="/payment-status" element={<PaymentStatus />}/>
      <Route path="/mybookings" element={<MyBookings />}/>
      <Route path="/wallet" element={<Wallet />}/>
    </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App