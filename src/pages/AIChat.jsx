import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/shared/Navbar';
import BlockRain from '../components/shared/BlockRain';
import ShootingStar from '../components/shared/ShootingStar';
import LoveHeartCursor from '../components/shared/LoveHeartCursor';
import SparklesCursor from '../components/shared/SparklesCursor';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { chatWithAI, getConversationHistory } from '../services/aiService';

const AIChat = () => {
  const { user } = useAuth();
  const { colors, agentName, theme, background, font, cursor } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const response = await getConversationHistory();
      const history = response.data.conversations.reverse().map(c => ([
        { text: c.userMessage, isUser: true },
        { text: c.aiMessage, isUser: false }
      ])).flat();
      setMessages(history);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setLoading(true);

    try {
      const response = await chatWithAI(userMessage);
      setMessages(prev => [...prev, { text: response.message, isUser: false }]);
    } catch (error) {
      console.error('Chat error:', error);
      console.error('Backend error:', error.response?.data);
      const errorMsg = error.response?.status === 404 
        ? "AI chat endpoint not found. Make sure your backend has /api/ai/chat route set up!"
        : error.response?.data?.error || "Having trouble connecting right now. Try again!";
      setMessages(prev => [...prev, { 
        text: errorMsg, 
        isUser: false 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative"
      style={cursor ? { cursor: `url(${cursor}), auto` } : {}}
    >
      {/* Shooting stars effect for Nova theme */}
      {theme === 'cosmic' && <ShootingStar />}
      
      {/* Sparkles cursor effect for Nova theme */}
      {theme === 'cosmic' && <SparklesCursor />}
      
      {/* Flower cursor effect for Bloom theme */}
      {theme === 'garden' && <LoveHeartCursor />}
      
      {/* Block rain effect for Pixel theme */}
      {theme === 'neon' && <BlockRain />}
      
      {/* background image */}
      {background && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}
      
      <div className="relative z-10">
        <Navbar />
      
      <div className={`max-w-4xl mx-auto p-6 ${font || ''}`}>
        {/* my header */}
        <div className={`${colors.gradient} text-white rounded-xl p-6 mb-6 backdrop-blur-md`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-2xl font-bold">
              {agentName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{agentName}</h1>
              <p className="text-sm opacity-90">Your AI Money Buddy</p>
            </div>
          </div>
        </div>

        {/* the chat */}
        <div className={`${colors.cardBg} backdrop-blur-md rounded-xl shadow-lg p-6 mb-6 h-96 overflow-y-auto`}>
          {messages.length === 0 ? (
            <div className={`text-center ${colors.cardText} mt-20`}>
              <p className="text-lg mb-2">Start chatting with {agentName}</p>
              <p className="text-sm opacity-70">Ask about your budget, savings, or money tips</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                    msg.isUser 
                      ? `${colors.primary} text-white` 
                      : `bg-white/10 ${colors.cardText}`
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className={`bg-white/10 px-4 py-3 rounded-2xl`}>
                    <div className="flex gap-2">
                      <div className={`w-2 h-2 ${colors.primary} rounded-full animate-bounce`}></div>
                      <div className={`w-2 h-2 ${colors.primary} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                      <div className={`w-2 h-2 ${colors.primary} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* user input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${agentName} anything...`}
            className={`flex-1 px-4 py-3 ${colors.cardBg} ${colors.cardText} backdrop-blur-md border border-white/20 rounded-lg focus:outline-none focus:border-white/40 placeholder:text-gray-400`}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`${colors.primary} text-white px-6 py-3 rounded-lg font-semibold ${colors.hover} disabled:opacity-50 transition-all`}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default AIChat;