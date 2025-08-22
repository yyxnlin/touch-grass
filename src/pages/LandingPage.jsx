import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from "../components/Navbar"
import bottomDesign from "../assets/landing-page/bottom-design.png"
import bgImage from "../assets/landing-page/bg-image.png"

import Signup from './Signup';
import Login from './Login';

function LandingPage() {
    useEffect(() => {
        document.title = "touch grass.";
    }, []);

    const navigate = useNavigate();
    const handleSignupClick = () => navigate('/signup');
    const handleLoginClick = () => navigate('/login'); 

    const backgroundStyles = {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover'
    };

    return (
        <main style={backgroundStyles} className="grow flex flex-col justify-center">
            <Navbar handleSignupClick={handleSignupClick} handleLoginClick={handleLoginClick} />

            <header className="flex flex-col items-center">
                <h1 className="text-4xl font-bold text-8xl mt-5">touch grass.</h1>
                <p className="text-[#969696] mt-5">reconnect with nature (slogan - idk what to put)</p>
                <button className="bg-[#283618] text-white py-2 px-15 rounded-full mt-5 cursor-pointer"
                    onClick={handleSignupClick}>
                    Get Started
                </button>
            </header>
                
            <img src={bottomDesign} className="my-10"></img>
        </main>
    )
}

export default LandingPage;