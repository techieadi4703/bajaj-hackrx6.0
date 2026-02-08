import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Singup';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';

function App() {
  return (
   <div className="min-h-screen bg-[#e6f9ff]">
      <Navbar/>
      <div className="flex items-center justify-center py-10">
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default App
