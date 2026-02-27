import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, MicOff, Bot, User, Loader, Volume2 } from 'lucide-react';
import './Chatbot.css';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const systemPrompt = `You are AgroVault AI Assistant, a helpful chatbot for a smart agricultural warehouse management platform. You help warehouse managers and consumers with:
- Inventory management and stock queries
- Sensor readings and environmental monitoring
- Logistics and shipment tracking
- Quality reports and crop storage best practices
- General agricultural storage knowledge
Keep responses concise and helpful. Use bullet points when listing multiple items.`;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I\'m your AgroVault AI assistant. How can I help you with your warehouse operations today?' },
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
            };

            recognition.onerror = () => {
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

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
        const cleanText = text.replace(/[*#_~`]/g, '').replace(/\n/g, '. ');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        synthRef.current.speak(utterance);
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: '⚠️ Gemini API key not configured. Add `VITE_GEMINI_API_KEY` to your `.env` file in the Frontend directory.\n\nExample:\n```\nVITE_GEMINI_API_KEY=your_api_key_here\n```' },
            ]);
            setLoading(false);
            return;
        }

        try {
            const conversationHistory = messages.map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            }));

            const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: [
                        ...conversationHistory,
                        { role: 'user', parts: [{ text: userMessage.content }] },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    },
                }),
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                const assistantText = data.candidates[0].content.parts[0].text;
                setMessages((prev) => [...prev, { role: 'assistant', content: assistantText }]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: 'Sorry, I couldn\'t process that request. Please try again.' },
                ]);
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `Error connecting to AI: ${error.message}. Please check your API key and network connection.` },
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
        // Basic markdown: bold, code blocks, bullet points
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
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar"><Bot size={20} /></div>
                            <div>
                                <div className="chatbot-title">AgroVault AI</div>
                                <div className="chatbot-subtitle">Powered by Gemini</div>
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
                            placeholder={isListening ? 'Listening...' : 'Ask me anything...'}
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
