import React, {createContext, useState, useContext} from 'react'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [name, setName] = useState(localStorage.getItem('name') || null);

    const Login = (token, name) => {
        setToken(token);
        setName(name);
        localStorage.setItem('token', token);
        localStorage.setItem('id', name);
    }

    const Logout = () => {
        setToken(null);
        setName(null);
        localStorage.removeItem('token');
        localStorage.removeItem('id');
    }
    
    return(
        <AuthContext.Provider value={{token, name, Login, Logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext