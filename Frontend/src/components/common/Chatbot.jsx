import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, X, Send, Mic, MicOff, Bot, User, Loader, Volume2, Compass } from 'lucide-react';
import './Chatbot.css';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const getSystemPrompt = (role) => `You are AgroVault AI Assistant, a helpful chatbot for a smart agricultural warehouse management platform. You have two main functions:
1. HELP: Answer questions about inventory, sensors, and logistics.
2. NAVIGATE: Help users move through the website.

The user's role is: ${role}.

AVAILABLE PAGES FOR ${role.toUpperCase()}:
${role === 'warehouse' ? `
- Dashboard: /warehouse/dashboard
- Inventory: /warehouse/inventory
- Storage: /warehouse/storage
- Sensors: /warehouse/sensors
- Logistics: /warehouse/logistics
- Quality Control: /warehouse/quality
- Analytics: /warehouse/analytics
- Alerts: /warehouse/alerts
- Settings: /warehouse/settings
` : `
- Dashboard: /consumer/dashboard
- Inventory: /consumer/inventory
- Shipments: /consumer/shipments
- Quality: /consumer/quality
- Warehouses: /consumer/warehouses
- Alerts: /consumer/alerts
`}

COMMANDS:
If the user wants to go to a specific page (e.g., "Take me to inventory", "Show sensors", "Open settings"), respond with:
"Sure, taking you to the [Page Name] now. [[NAVIGATE:path]]"
Replace 'path' with the actual path from the list above.

Keep responses concise and helpful. Use bullet points when listing multiple items.`;

const Chatbot = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I\'m your AgroVault AI assistant. I can help you with info or help you navigate the site. Try saying "Go to inventory" or "Show me analytics"!' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
                // Auto-send if it sounds like a command
                if (transcript.toLowerCase().includes('go to') || 
                    transcript.toLowerCase().includes('show') || 
                    transcript.toLowerCase().includes('open')) {
                    setTimeout(() => handleNavigationCommand(transcript), 500);
                }
            };

            recognition.onerror = () => {
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, [user]);

    const handleNavigationCommand = (text) => {
        if (!user) return false;
        const lowText = text.toLowerCase();
        const role = user.role || 'consumer';
        
        const routes = {
            warehouse: {
                'dashboard': '/warehouse/dashboard',
                'home': '/warehouse/dashboard',
                'inventory': '/warehouse/inventory',
                'stock': '/warehouse/inventory',
                'storage': '/warehouse/storage',
                'silo': '/warehouse/storage',
                'sensor': '/warehouse/sensors',
                'iot': '/warehouse/sensors',
                'logistics': '/warehouse/logistics',
                'shipment': '/warehouse/logistics',
                'truck': '/warehouse/logistics',
                'quality': '/warehouse/quality',
                'check': '/warehouse/quality',
                'analytic': '/warehouse/analytics',
                'statistic': '/warehouse/analytics',
                'trend': '/warehouse/analytics',
                'alert': '/warehouse/alerts',
                'warning': '/warehouse/alerts',
                'setting': '/warehouse/settings',
                'profile': '/warehouse/settings',
            },
            consumer: {
                'dashboard': '/consumer/dashboard',
                'home': '/consumer/dashboard',
                'inventory': '/consumer/inventory',
                'stock': '/consumer/inventory',
                'shipment': '/consumer/shipments',
                'order': '/consumer/shipments',
                'quality': '/consumer/quality',
                'warehouse': '/consumer/warehouses',
                'map': '/consumer/warehouses',
                'alert': '/consumer/alerts',
            }
        };

        const roleRoutes = routes[role] || routes.consumer;
        
        for (const [key, path] of Object.entries(roleRoutes)) {
            if (lowText.includes(key)) {
                setMessages(prev => [...prev, 
                    { role: 'user', content: text },
                    { role: 'assistant', content: `Sure! Navigating you to the ${key} page now.` }
                ]);
                setTimeout(() => {
                    navigate(path);
                    setIsOpen(false);
                }, 1000);
                return true;
            }
        }
        return false;
    };

    const toggleVoice = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const speakText = (text) => {
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
            setIsSpeaking(false);
            return;
        }
        // Remove navigation tags before speaking
        const cleanText = text.replace(/\[\[NAVIGATE:.*?\]\]/g, '').replace(/[*#_~`]/g, '').replace(/\n/g, '. ');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        synthRef.current.speak(utterance);
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const originalInput = input.trim();
        setInput('');

        // Try local navigation first
        if (handleNavigationCommand(originalInput)) {
            return;
        }

        const userMessage = { role: 'user', content: originalInput };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: '⚠️ Gemini API key not configured. Add `VITE_GEMINI_API_KEY` to your `.env` file in the Frontend directory.' },
            ]);
            setLoading(false);
            return;
        }

        try {
            const role = user?.role || 'consumer';
            const conversationHistory = messages.slice(-5).map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            }));

            const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: getSystemPrompt(role) }] },
                    contents: [
                        ...conversationHistory,
                        { role: 'user', parts: [{ text: userMessage.content }] },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 512,
                    },
                }),
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                let assistantText = data.candidates[0].content.parts[0].text;
                
                // Check if the AI wants to navigate
                const navMatch = assistantText.match(/\[\[NAVIGATE:(.*?)\]\]/);
                if (navMatch) {
                    const navPath = navMatch[1];
                    const cleanText = assistantText.replace(/\[\[NAVIGATE:.*?\]\]/g, '').trim();
                    setMessages((prev) => [...prev, { role: 'assistant', content: cleanText }]);
                    setTimeout(() => {
                        navigate(navPath);
                        setIsOpen(false);
                    }, 1500);
                } else {
                    setMessages((prev) => [...prev, { role: 'assistant', content: assistantText }]);
                }
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: 'Sorry, I couldn\'t process that request. Please try again.' },
                ]);
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `Error connecting to AI: ${error.message}` },
            ]);
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatMessage = (text) => {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/```[\s\S]*?```/g, (match) => `<pre>${match.replace(/```/g, '')}</pre>`)
            .replace(/^[-•] (.+)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <>
            {/* Chat FAB */}
            <button
                className={`chatbot-fab ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="AgroVault AI Assistant"
            >
                {isOpen ? <X size={24} /> : <Compass size={24} className="animate-pulse" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar"><Bot size={20} /></div>
                            <div>
                                <div className="chatbot-title">AgroVault AI</div>
                                <div className="chatbot-subtitle">Voice Navigation Enabled</div>
                            </div>
                        </div>
                        <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-message ${msg.role}`}>
                                <div className="chat-message-icon">
                                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div className="chat-message-content">
                                    <div
                                        className="chat-message-text"
                                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                    />
                                    {msg.role === 'assistant' && i > 0 && (
                                        <button
                                            className="chat-speak-btn"
                                            onClick={() => speakText(msg.content)}
                                            title="Read aloud"
                                        >
                                            <Volume2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="chat-message assistant">
                                <div className="chat-message-icon"><Bot size={16} /></div>
                                <div className="chat-message-content">
                                    <div className="chat-typing">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <button
                            className={`voice-btn ${isListening ? 'listening' : ''}`}
                            onClick={toggleVoice}
                            title={isListening ? 'Stop listening' : 'Voice input'}
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <input
                            type="text"
                            placeholder={isListening ? 'Listening...' : 'Type "Go to inventory"...'}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />
                        <button
                            className="send-btn"
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
