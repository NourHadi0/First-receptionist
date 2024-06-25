import React, {createContext, useState, useContext} from 'react'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);

    const Login = (token, role) => {
        setToken(token);
        setRole(role);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
    }

    const Logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }
    
    return(
        <AuthContext.Provider value={{token, role, Login, Logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext