import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { sendChatMessage, clearChatSession } from '../services/chatbotService';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'bot',
            text: "Hi there 👋 Welcome to Sunline Restaurant! How can I help you today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);
    const { addToCart } = useCart();

    const location = useLocation();
    const allowedRoutes = ['/', '/menu'];
    const shouldShowChatbot = allowedRoutes.includes(location.pathname);

    // Quick reply suggestions shown at the start
    const QUICK_REPLIES = [
        "What's on the menu?",
        "Help me choose something to eat",
        "Add items to my cart",
        "View my cart",
    ];

    useEffect(() => {
        if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleClose = async () => {
        setIsOpen(false);
        await clearChatSession(sessionId);
    };

    const handleSend = async (text) => {
        const messageText = (text || input).trim();
        if (!messageText) return; // Scenario 2: prevent empty message

        // Add customer message to chat
        const userMsg = {
            id: Date.now(),
            role: 'user',
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const data = await sendChatMessage(messageText, sessionId);

            // Save sessionId for conversation continuity
            if (data.sessionId && !sessionId) setSessionId(data.sessionId);

            // If the backend returned cartItems, add them to the cart context
            if (data.cartItems && data.cartItems.length > 0) {
                data.cartItems.forEach((item) => {
                    addToCart(
                        {
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            description: item.description,
                            imageUrl: item.imageUrl,
                        },
                        item.quantity || 1,
                        ''
                    );
                });
            }

            const botMsg = {
                id: Date.now() + 1,
                role: 'bot',
                text: data.reply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                redirectTo: data.redirectTo,
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: 'bot',
                    text: "Sorry, I'm having trouble connecting. Please try again in a moment!",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const showQuickReplies = messages.length === 1; // Only show after welcome message

    if (!shouldShowChatbot) return null;

    return (
        <>
            {/* Chat window */}
            {isOpen && (
                <div
                    className="fixed right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-[1000] overflow-hidden"
                    style={{ bottom: 'calc(74px + 8px + 64px)', maxHeight: '520px' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center">
                                <Bot size={16} className="text-white" />
                            </div>
                            <span className="font-semibold text-gray-800 text-sm">Virtual Assistant</span>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50" style={{ minHeight: 0 }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] ${msg.role === 'user' ? '' : ''}`}>
                                    <div
                                        className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                                            msg.role === 'user'
                                                ? 'bg-[#f97316] text-white rounded-br-sm'
                                                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <p className={`text-[10px] text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                                    <div className="flex space-x-1">
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick replies */}
                        {showQuickReplies && !isLoading && (
                            <div className="flex flex-wrap gap-2 justify-end pt-1">
                                {QUICK_REPLIES.map((qr) => (
                                    <button
                                        key={qr}
                                        onClick={() => handleSend(qr)}
                                        className="text-xs px-3 py-1.5 bg-[#f97316] text-white rounded-full hover:bg-orange-600 transition-colors"
                                    >
                                        {qr}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className="px-3 py-3 bg-white border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Write your message..."
                                disabled={isLoading}
                                className="flex-1 text-sm px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] disabled:opacity-50 transition-colors"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f97316] text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                            >
                                <Send size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating toggle button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="fixed right-6 w-14 h-14 rounded-full bg-[#f97316] text-white shadow-lg hover:bg-orange-600 flex items-center justify-center z-[1000] transition-all hover:scale-105 active:scale-95"
                style={{ bottom: 'calc(74px + 8px)' }}
                aria-label="Open chat"
            >
                {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
                {/* Unread indicator dot (shows before first open) */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] font-bold flex items-center justify-center">
                        1
                    </span>
                )}
            </button>
        </>
    );
};

export default ChatbotWidget;
