import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import { AuthProvider } from './AuthContext';
import Home from './Pages/Home';
import StoreRecord from './Pages/Storerecord';
import StoreWomenRecord from './Pages/StoreWomenRecord';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
          <Route path='/addchild' element={<StoreRecord />} />
          <Route path='/addwoman' element={<StoreWomenRecord />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
