import React, { useContext, useRef, useState, useEffect } from "react";
import { userDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiI from "../assets/ai.gif"
import userI from "../assets/User.gif"
import { IoMdMenu } from "react-icons/io"
import { RxCross2 } from "react-icons/rx";

function Home(){
    const {userData, serverUrl, setUserData, getGeminiResponse} = useContext(userDataContext)
    const navigate = useNavigate();
    
    // Refs
    const isSpeakingRef = useRef(false);
    const recognitionRef = useRef(null);
    const isRecognizingRef = useRef(false);
    const shouldRestartRef = useRef(true);
    const restartTimeoutRef = useRef(null);
    
    // State
    const [listening, setListening] = useState(false);
    const [userText, setUserText] = useState("");
    const [aiText, setAiText] = useState("");
    const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
    const [ham, setHam] = useState(false);

    const handleLogOut = async() => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/logout`, {
                withCredentials: true
            });
            setUserData(null);
            navigate("/signin");
        } catch (error) {
            console.log(error);
        }
    }

    // Clear restart timeout
    const clearRestartTimeout = () => {
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = null;
        }
    }

    // Safe start recognition
    const startRecognition = () => {
        if (isSpeakingRef.current || isRecognizingRef.current || !shouldRestartRef.current || !recognitionRef.current) {
            return;
        }

        try {
            recognitionRef.current.start();
        } catch (error) {
            if (error.name !== 'InvalidStateError') {
                console.error('Recognition start error:', error);
            }
        }
    }

    // Safe stop recognition
    const stopRecognition = () => {
        clearRestartTimeout();
        
        if (recognitionRef.current && isRecognizingRef.current) {
            try {
                recognitionRef.current.stop();
                console.log("Recognition stopped");
            } catch (error) {
                console.error('Recognition stop error:', error);
            }
        }
        
        isRecognizingRef.current = false;
        setListening(false);
    }

    // Schedule recognition restart
    const scheduleRestart = (delay = 2000) => {
        clearRestartTimeout();
        if (shouldRestartRef.current && !isSpeakingRef.current) {
            restartTimeoutRef.current = setTimeout(() => {
                startRecognition();
            }, delay);
        }
    }

    const synth = window.speechSynthesis;

    const speakAdvanced = (text, options = {}) => {
        if ('speechSynthesis' in window) {
            // Stop recognition before speaking
            stopRecognition();
            
            // Cancel any ongoing speech
            synth.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            utterance.rate = options.rate || 1;
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || 1;
            utterance.lang = options.lang || 'en-US';

            if (options.voice) {
                utterance.voice = options.voice;
            }
            
            isSpeakingRef.current = true;
            setIsAssistantSpeaking(true);
            
            utterance.onend = () => {
                console.log('Speech ended');
                isSpeakingRef.current = false;
                setIsAssistantSpeaking(false);
                
                // Clear AI text after speech ends
                setTimeout(() => {
                    setAiText("");
                }, 1000);
                
                // Restart recognition after speech
                scheduleRestart(2000);
            }
            
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                isSpeakingRef.current = false;
                setIsAssistantSpeaking(false);
                scheduleRestart(2000);
            }
            
            synth.speak(utterance);
        }
    };

    const speaking = (text) => {
        speakAdvanced(text, {rate: 1, pitch: 1, volume: 1, lang: 'en-US'});
    }

    const handleManualSpeak = () => {
        if (!isSpeakingRef.current) { // Only speak if not already speaking
            const greetingMessage = `Hello! I'm ${userData?.assistantName || 'your assistant'}. How can I help you today?`;
            setAiText(greetingMessage);
            speaking(greetingMessage);
        }
    };

    const handleCommand = (data) => {
        const { type, userInput, response } = data;
        let spokenResponse = response;

        switch (type) {
            case 'google-search':
                const query = encodeURIComponent(userInput);
                window.open(`https://www.google.com/search?q=${query}`, '_blank');
                break;
            case 'calculator_open':
                window.open(`https://www.google.com/search?q=calculator`, '_blank');
                spokenResponse = "Opening calculator for you";
                break;
            case 'instagram_open':
                window.open(`https://www.instagram.com`, '_blank');
                spokenResponse = "Opening Instagram for you";
                break;
            case 'facebook_open':
                window.open(`https://www.facebook.com`, '_blank');
                spokenResponse = "Opening facebook for you";
                break;
            case 'whatsapp_open':
                window.open(`https://web.whatsapp.com`, '_blank');
                spokenResponse = "Opening whatsapp for you";
                break;
            case 'weather-show':
                window.open(`https://www.google.com/search?q=weather`, '_blank');
                break;
            case 'joke':
                const jokes = [
                    "Why don't scientists trust atoms? Because they make up everything!",
                    "Why did the scarecrow win an award? He was outstanding in his field!",
                    "Why don't programmers like nature? It has too many bugs!"
                ];
                spokenResponse = jokes[Math.floor(Math.random() * jokes.length)];
                break;
            case 'wikipedia-search':
                const wikiQuery = encodeURIComponent(userInput);
                window.open(`https://en.wikipedia.org/wiki/Special:Search?search=${wikiQuery}`, '_blank');
                break;
            case 'news-search':
                window.open(`https://news.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank');
                break;
            case 'quote':
                const quotes = [
                    "The only way to do great work is to love what you do. - Steve Jobs",
                    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
                    "Life is what happens to you while you're busy making other plans. - John Lennon"
                ];
                spokenResponse = quotes[Math.floor(Math.random() * quotes.length)];
                break;
            case 'fact':
                const facts = [
                    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
                    "A group of flamingos is called a 'flamboyance'.",
                    "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes."
                ];
                spokenResponse = facts[Math.floor(Math.random() * facts.length)];
                break;
            case 'navigation':
            case 'provide_navigation':
                const location = encodeURIComponent(userInput);
                window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, '_blank');
                break;
            /*case 'translation':
                window.open(`https://translate.google.com/?text=${encodeURIComponent(userInput)}`, '_blank');
                break;*/
            case 'send_email':
                window.open(`mailto:?subject=&body=${encodeURIComponent(userInput)}`, '_blank');
                break;
            case 'make_call':
                window.open(`tel:${userInput}`, '_blank');
                spokenResponse="Sorry, I cann't make call directly. I can only open phone directory for you"
                break;
            case 'play_music':
            case 'music-playback':
            case 'youtube-search':
            case 'youtube_play':
            case 'video-playbook':
            case 'play_video':
                const ytQuery = encodeURIComponent(userInput);
                window.open(`https://www.youtube.com/results?search_query=${ytQuery}`, '_blank');
                break;
            case 'calendar':
                window.open('https://calendar.google.com', '_blank');
                spokenResponse = "Opening Google Calendar for you";
                break;
            default:
                console.log('Unknown command type:', type);
        }

        if (spokenResponse) {
            setAiText(spokenResponse);
            speaking(spokenResponse);
        }
    };

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.error('Speech recognition not supported');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognitionRef.current = recognition;
        shouldRestartRef.current = true;

        recognition.onstart = () => {
            isRecognizingRef.current = true;
            setListening(true);
        }

        recognition.onresult = async (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            console.log("Heard:", transcript);
            
            // Show what user said
            setUserText(transcript);
            
            if (transcript.toLowerCase().includes(userData?.assistantName?.toLowerCase())) {
                try {
                    stopRecognition();
                    
                    const data = await getGeminiResponse(transcript);
                    if (data) {
                        console.log(data);
                        handleCommand(data);
                        
                        // Clear user text after processing
                        setTimeout(() => setUserText(""), 3000);
                    }
                } catch (error) {
                    console.error("Error getting Gemini response:", error);
                    setAiText("");
                    setUserText("");
                    scheduleRestart(3000);
                }
            } else {
                // Clear user text if assistant name not mentioned
                setTimeout(() => setUserText(""), 2000);
            }
        };

        recognition.onend = () => {
            isRecognizingRef.current = false;
            setListening(false);

            if (shouldRestartRef.current && !isSpeakingRef.current) {
                scheduleRestart(1500);
            }
        };

        recognition.onerror = (event) => {
            console.log(`Recognition error: ${event.error}`);
            isRecognizingRef.current = false;
            setListening(false);
            
            // Handle different error types
            switch (event.error) {
                case 'aborted':
                    console.log('Recognition aborted - not restarting');
                    break;
                case 'audio-capture':
                    console.log('Audio capture error - check microphone permissions');
                    scheduleRestart(5000);
                    break;
                case 'network':
                    console.log('Network error - retrying in 5 seconds');
                    scheduleRestart(5000);
                    break;
                case 'not-allowed':
                    console.log('Microphone permission denied');
                    shouldRestartRef.current = false;
                    break;
                case 'no-speech':
                    console.log('No speech detected - restarting');
                    scheduleRestart(1000);
                    break;
                default:
                    console.log(`Other error (${event.error}) - restarting`);
                    scheduleRestart(2000);
                    break;
            }
        };

        // Initial start with delay
        setTimeout(() => {
            if (shouldRestartRef.current) {
                startRecognition();
            }
        }, 1000);

        // Cleanup function
        return () => {
            console.log("Cleaning up recognition");
            shouldRestartRef.current = false;
            clearRestartTimeout();
            stopRecognition();
            recognitionRef.current = null;
        }

    }, [userData, getGeminiResponse]);

    // Handle menu interactions
    const handleMenuClose = (e) => {
        e.stopPropagation();
        setHam(false);
    }

    const handleMenuClick = (e) => {
        e.stopPropagation();
    }

    const handleMenuOpen = (e) => {
        e.stopPropagation();
        setHam(true);
    }

    const shouldShowAiGif = isAssistantSpeaking || (aiText && !userText);
    const shouldShowUserGif = listening || userText || (!isAssistantSpeaking && !aiText);
    
    return (
        <div className="w-full h-full min-h-[100vh] bg-gradient-to-t from-[black] to-[#202353] flex justify-center items-center flex-col gap-[25px] overflow-hidden" onClick={() => setHam(false)}>
            <IoMdMenu 
                className="lg:hidden text-white absolute top-[20px] right-[20px] w-[35px] h-[35px] cursor-pointer z-10" 
                onClick={handleMenuOpen}
            />
            
            <div className={`top-0 absolute w-full h-full bg-[#00000053] lg:hidden backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-[100%]"} transition-transform z-50`} onClick={handleMenuClick}>
                <RxCross2 
                    className="text-[white] absolute top-[20px] right-[20px] w-[35px] h-[35px] font-bold cursor-pointer hover:text-gray-300" 
                    onClick={handleMenuClose}
                />
                <button className='bg-white rounded-full text-[black] font-semibold text-[19px] cursor-pointer hover:shadow-2xl hover:shadow-blue-700 top-[25px] right-[20px] mt-[20px] px-[20px] py-[10px] hover:border-1 hover:border-#202353' onClick={handleLogOut}>
                    Log Out
                </button>
                <button className='bg-white rounded-full text-[black] font-semibold text-[19px] cursor-pointer hover:shadow-2xl top-[110px] right-[20px] px-[20px] py-[10px] hover:shadow-blue-800 hover:border-1 hover:border-#202353' onClick={() => navigate("/customize")}>
                    Customize Your Assistant
                </button>
            </div>

            <button className='bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer hover:shadow-2xl absolute hidden lg:block hover:shadow-blue-700 top-[25px] right-[20px] px-[20px] py-[10px] hover:border-1 hover:border-#202353' onClick={handleLogOut}>
                Log Out
            </button>
            <button className='bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer hover:shadow-2xl absolute top-[110px] right-[20px] px-[20px] py-[10px] hover:shadow-blue-800 hover:border-1 hidden lg:block hover:border-#202353' onClick={() => navigate("/customize")}>
                Customize Your Assistant
            </button>

            <div className="w-full text-white max-w-[350px] h-full max-h-[450px] flex justify-center mt-[20px] items-center overflow-hidden rounded-4xl border-white shadow-1g">
                <img src={userData?.assistantImage} alt="" className="h-full object-cover"/>
            </div>
            
            <h1 className="text-white text-[30px] font-semibold">I'm {userData?.assistantName}</h1>
            
            {/* Display what user said */}
            {userText && (
                <div className="text-white px-4 py-2 rounded-lg max-w-[80%] text-center">
                    <p className="font-medium">{userText}</p>
                </div>
            )}
            
            {/* Display AI response */}
            {aiText && (
                <div className="text-white px-4 py-2 rounded-lg max-w-[80%] text-center">
                    <p className="font-medium">{aiText}</p>
                </div>
            )}
            
            {shouldShowAiGif ? (
                <img src={aiI} alt="AI speaking" className="w-[200px]"/>
            ) : (
                <img src={userI} alt="Listening to user" className="w-[200px]"/>
            )}

            {listening && (
                <div className="text-white text-center">
                    <p className="text-lg">🎤 Listening...</p>
                    <p className="text-sm opacity-75">Say "{userData?.assistantName}" to activate</p>
                </div>
            )}

            <button 
                className="bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer hover:shadow-2xl absolute bottom-[90px] right-[20px] px-[20px] py-[10px] hover:shadow-blue-800 hover:border-1 hover:border-#202353" 
                onClick={handleManualSpeak}
                disabled={isAssistantSpeaking}
            >
                {isAssistantSpeaking ? 'Speaking...' : 'Assistant Speak'}
            </button>
        </div>
    )
}

export default Home;
