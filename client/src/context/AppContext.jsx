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


    const backendUrl = "https://imagify-rqoo.onrender.com"

    const loadCreditsData = async ()=>{
        try {
            const {data} = await axios.get(`${backendUrl}/api/users/credits`,
                 {headers: {Authorization: `Bearer ${token}`}});
            
                 if(data.success){
                    setCredit(data.credits);
                    setUser(data.user);
                 } else {
                    console.log('Credits API responded:', data);
                 }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const generateImage = async (prompt) => {

        if (!token) {
            toast.error('Please login first');
            return null;
        }


        try {
            const { data } = await axios.post(`${backendUrl}/api/image/generate-image`, { prompt }, {
                headers: { Authorization: `Bearer ${token}` }
            });


            if(data.success){
                await loadCreditsData();
                return data.imageurl || data.resultImage;
            } 
            return {
                success: false,
                creditBalance: data.creditBalance,
                message: data.message || 'Generation failed'
            };
        } catch (error) {
            console.error('generateImage error:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || error.message);
            return { success: false, message: error.message || 'Something went wrong' };
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