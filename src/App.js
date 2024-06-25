import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import { AuthProvider } from './AuthContext';
import Home from './Pages/Home';
import StoreRecord from './Pages/Storerecord';
import StoreWomenRecord from './Pages/StoreWomenRecord';
import { useEffect } from 'react';
import Logo from './images/Logo.ico'

function App() {

  useEffect(() => {
    document.title = 'Receptionist';
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = Logo;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

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
