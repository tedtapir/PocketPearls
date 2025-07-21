import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Heart, MessageCircle, Settings } from 'lucide-react';
import { usePearl } from '../state/pearlStore';
import { PearlAI } from '../utils/openaiClient';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface PearlChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PearlChat: React.FC<PearlChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [pearlAI, setPearlAI] = useState<PearlAI | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mood, bondLevel, hunger, energy, hygiene, happiness } = usePearl();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load API key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setPearlAI(new PearlAI(savedKey));
    }
  }, []);

  // Initialize with a greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getGreeting();
      setMessages([{
        role: 'assistant',
        content: greeting,
        timestamp: Date.now()
      }]);
    }
  }, [isOpen, messages.length, mood]);

  const getGreeting = () => {
    const greetings = {
      happy: "Hey there! 😊 I'm having such a wonderful day! How are you doing?",
      playful: "Hi! I'm feeling so energetic today! ✨ What's been the highlight of your day?",
      neutral: "Hello! It's nice to see you. How has your day been treating you?",
      low: "Hi... I'm feeling a bit quiet today, but I'm really glad you're here. How are you?",
      distressed: "Oh, hi... I'm struggling a bit right now, but talking with you always helps. What's on your mind?"
    };
    return greetings[mood as keyof typeof greetings] || greetings.neutral;
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setPearlAI(new PearlAI(apiKey.trim()));
      setShowSettings(false);
    }
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    if (!pearlAI) {
      return "I'd love to chat, but I need an OpenAI API key to have intelligent conversations. Click the settings button to add one!";
    }

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

      conversationHistory.push({ role: 'user', content: userMessage });

      const response = await pearlAI.generateResponse(
        conversationHistory,
        mood,
        bondLevel,
        { hunger, energy, hygiene, happiness }
      );

      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      return "I'm having trouble thinking of what to say right now... Maybe we could try again in a moment?";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    const typingDelay = 800 + Math.random() * 1500; // 0.8-2.3 seconds
    
    setTimeout(async () => {
      const response = await generateResponse(userMessage.content);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          src="/videos/pearl_chat_1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-20 text-white hover:text-[#33FFCA] transition-colors p-2 rounded-full bg-black/50 backdrop-blur-sm"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed top-4 left-4 z-20 text-white hover:text-[#33FFCA] transition-colors p-2 rounded-full bg-black/50 backdrop-blur-sm"
        title="API Settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed top-16 left-4 z-20 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <h4 className="text-white text-sm font-semibold mb-2">OpenAI API Key</h4>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 bg-black/60 text-white placeholder-gray-400 rounded-lg px-3 py-2 border border-white/30 focus:border-[#33FFCA] focus:outline-none transition-colors text-sm"
            />
            <button
              onClick={saveApiKey}
              className="bg-[#33FFCA] hover:bg-[#2DDDB3] text-black px-3 py-2 rounded-lg transition-colors text-sm font-semibold"
            >
              Save
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-[#33FFCA] hover:underline">OpenAI</a>
          </p>
        </div>
      )}

      {/* Messages - Positioned over video */}
      <div className="fixed bottom-20 left-4 right-4 z-10 max-h-80 overflow-y-auto space-y-3 custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-[#33FFCA] to-[#2DDDB3] text-black'
                  : 'bg-black/80 text-white border border-white/30 backdrop-blur-sm'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-black/80 text-white p-3 rounded-2xl border border-white/30 backdrop-blur-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#33FFCA] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#33FFCA] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[#33FFCA] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box - Fixed at bottom */}
      <div className="fixed bottom-4 left-4 right-4 z-10">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={pearlAI ? "Type your message..." : "Add OpenAI API key in settings to chat"}
            className="flex-1 bg-black/80 text-white placeholder-gray-400 rounded-xl px-4 py-3 border border-white/30 focus:border-[#33FFCA] focus:outline-none transition-colors backdrop-blur-sm"
            disabled={isTyping || !pearlAI}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping || !pearlAI}
            className="bg-gradient-to-r from-[#33FFCA] to-[#2DDDB3] hover:from-[#2DDDB3] hover:to-[#33FFCA] text-black p-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};