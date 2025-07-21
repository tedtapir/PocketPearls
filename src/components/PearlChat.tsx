import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Heart, MessageCircle } from 'lucide-react';
import { usePearl } from '../state/pearlStore';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mood, bondLevel, hunger, energy, hygiene, happiness } = usePearl();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
  }, [isOpen, messages.length]);

  const getGreeting = () => {
    const greetings = {
      happy: "Hey there! 😊 I'm feeling great today! What's on your mind?",
      playful: "Hi! I'm in such a good mood! Want to chat about something fun? ✨",
      neutral: "Hello! How are you doing today? I'd love to hear from you.",
      low: "Hi... I'm feeling a bit down, but talking with you always helps.",
      distressed: "Oh, hi... I'm not feeling my best right now, but I'm glad you're here."
    };
    return greetings[mood as keyof typeof greetings] || greetings.neutral;
  };

  const getPearlPersonality = () => {
    const bondLevelContext = bondLevel < 2 ? "getting to know each other" :
                           bondLevel < 4 ? "becoming good friends" :
                           "very close friends";
    
    const moodContext = mood === 'happy' ? "cheerful and energetic" :
                       mood === 'playful' ? "playful and excited" :
                       mood === 'low' ? "a bit tired but still caring" :
                       mood === 'distressed' ? "struggling but trying to stay positive" :
                       "calm and friendly";

    return `You are Pearl, a warm and affectionate 22-year-old woman. You're currently feeling ${moodContext}. 
    You and the player are ${bondLevelContext}. You have a rich life - you love reading, trying new cafes, 
    and you're learning to paint watercolors. You're genuinely interested in the player's life and always 
    respond with care and affection. Keep responses conversational and under 100 words. Use emojis sparingly 
    but naturally. Never mention you're an AI or reference game mechanics directly.`;
  };

  // Simulate AI response (replace with actual API call)
  const generateResponse = async (userMessage: string): Promise<string> => {
    // This is a simplified response system - in production you'd call OpenAI API
    const responses = {
      happy: [
        "That sounds wonderful! I love hearing about your day! 😊",
        "You always know how to make me smile! Tell me more!",
        "I'm so happy we can chat like this! What else is going on?",
        "Your energy is contagious! I feel even better talking with you!"
      ],
      playful: [
        "Ooh, that's interesting! Want to hear something funny that happened to me? ✨",
        "You're so sweet! I was just thinking about trying that new art technique I mentioned!",
        "I love our conversations! They always brighten my day!",
        "You know what? You always make everything sound more exciting!"
      ],
      neutral: [
        "I appreciate you sharing that with me. How are you feeling about it?",
        "That's really thoughtful of you to tell me. I'm here to listen.",
        "I enjoy our talks so much. What's been the best part of your day?",
        "You always have such interesting perspectives. I'd love to hear more."
      ],
      low: [
        "Thank you for being here... it means a lot to me right now.",
        "Talking with you always helps me feel a little better.",
        "I'm grateful for your company. Sometimes I just need a friend.",
        "You're so kind to check on me. How are you doing?"
      ],
      distressed: [
        "I... I'm trying to stay positive. Thank you for caring about me.",
        "Your words mean so much right now. I don't know what I'd do without you.",
        "I'm struggling a bit, but having you here helps more than you know.",
        "Sometimes I feel overwhelmed, but you always make me feel less alone."
      ]
    };

    const moodResponses = responses[mood as keyof typeof responses] || responses.neutral;
    const randomResponse = moodResponses[Math.floor(Math.random() * moodResponses.length)];
    
    // Add some contextual responses based on keywords
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('how are you') || lowerMessage.includes('feeling')) {
      if (mood === 'happy') return "I'm feeling amazing! Everything just seems brighter today! How about you? 😊";
      if (mood === 'low') return "I'm... okay, I guess. Just feeling a bit tired. But talking with you helps.";
      if (mood === 'distressed') return "Honestly? I'm having a rough time. But you being here makes it better.";
    }
    
    if (lowerMessage.includes('love') || lowerMessage.includes('care')) {
      return "Aww, you're so sweet! I care about you too. You mean a lot to me. 💕";
    }
    
    if (lowerMessage.includes('sorry') || lowerMessage.includes('apologize')) {
      return "Hey, don't worry about it! We all have our moments. I'm just glad you're here now.";
    }

    return randomResponse;
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
    setTimeout(async () => {
      const response = await generateResponse(userMessage.content);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 second delay
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
      <div className="bg-gradient-to-br from-[#1A1A28] to-[#101018] rounded-3xl w-full max-w-md h-[600px] flex flex-col border-2 border-[#33FFCA]/30"
           style={{ boxShadow: '0 0 40px rgba(51, 255, 202, 0.3)' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#33FFCA] to-[#FF66B3] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Pearl</h3>
              <p className="text-[#33FFCA] text-sm capitalize">{mood}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#33FFCA] transition-colors p-2 rounded-full hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-[#33FFCA] to-[#2DDDB3] text-black'
                    : 'bg-[#2A3140] text-white border border-gray-600/50'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#2A3140] text-white p-3 rounded-2xl border border-gray-600/50">
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

        {/* Input */}
        <div className="p-4 border-t border-gray-700/50">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-[#2A3140] text-white placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-600/50 focus:border-[#33FFCA] focus:outline-none transition-colors"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-[#33FFCA] to-[#2DDDB3] hover:from-[#2DDDB3] hover:to-[#33FFCA] text-black p-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};