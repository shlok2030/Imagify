import { createContext } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props)=>{
    const [user, setUser] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const [credit, setCredit] = useState(false);


    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadCreditsData = async ()=>{
        try {
            const {data} = await axios.get(`${backendUrl}/api/users/credits`,
                 {headers: {token}});
            
                 if(data.success){
                    setCredit(data.credits);
                    setUser(data.user);
                 }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const generateImage = async (prompt) => {
        try {
            await axios.post(`${backendUrl}/api/image/generate-image`, {prompt}, {headers: {token}});

            if(data.success){
                loadCreditsData();
                return data.resultImage;
                if(data.creditBalance === 0){
                    navigate('/buy-credits');
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken('');
        setUser(null);
        toast.success("Logged out successfully");
    }

    useEffect(()=>{
        if(token){
            loadCreditsData();
        }
    }, [token]);
    // Check in your context file that backendUrl is correctly set
    console.log('Backend URL:', backendUrl);

    const value = {
        user, setUser, showLogin, setShowLogin, backendUrl, token, setToken, credit, setCredit, loadCreditsData, logout, generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;