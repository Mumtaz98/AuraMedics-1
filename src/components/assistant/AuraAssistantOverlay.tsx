import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  X,
  Bot,
  User,
  Terminal,
} from 'lucide-react';

export const AuraAssistantOverlay: React.FC = () => {
  const {
    isAuraOpen,
    setIsAuraOpen,
    chatMessages,
    setChatMessages,
    executeAuraTool,
    language,
    user,
    t,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking]);

  // Speech Recognition Setup
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Speech Recognition is not supported in this browser. Please type your message.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputMessage(transcript);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // Text-To-Speech Synthesis
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsgId = `msg_${Date.now()}`;
    setChatMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: textToSend, timestamp: 'Just now' },
    ]);
    setInputMessage('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          context: {
            patientId: user.patientId,
            name: user.name,
            bloodGroup: user.bloodGroup,
          },
        }),
      });

      const data = await response.json();
      setIsThinking(false);

      if (data.text) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg_aura_${Date.now()}`,
            sender: 'aura',
            text: data.text,
            timestamp: 'Just now',
            toolCall: data.toolCall,
          },
        ]);

        speakText(data.text);

        // Execute Tool Action
        if (data.toolCall?.toolName) {
          executeAuraTool(data.toolCall.toolName, data.toolCall.params);
        }
      }
    } catch (err) {
      setIsThinking(false);
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg_aura_err_${Date.now()}`,
          sender: 'aura',
          text: 'I apologize, I encountered a temporary network issue. Please try again.',
          timestamp: 'Just now',
        },
      ]);
    }
  };

  if (!isAuraOpen) return null;

  const quickChips = [
    'Show my CBC blood report',
    'Schedule Paracetamol dose for 2 PM',
    'Open Emergency Passport QR',
    'Find open pharmacies near me',
    'Show blood pressure trends',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0F172A] text-white rounded-3xl max-w-2xl w-full h-[92vh] sm:h-[85vh] max-h-[720px] border border-[#1E293B] shadow-2xl flex flex-col overflow-hidden">
        {/* Assistant Header */}
        <div className="p-3.5 sm:p-5 bg-[#0F172A] border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex items-center justify-center shrink-0">
              <div className="w-3.5 h-3.5 bg-sky-400 rounded-full animate-pulse shadow-[0_0_12px_#38BDF8]"></div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base text-white tracking-tight truncate">Aura AI Assistant</h2>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold border border-sky-500/30 shrink-0">
                  Online
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#94A3B8] font-medium truncate">
                Clinical Decision Support & Voice Controller
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsAuraOpen(false)}
              className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white transition-colors"
              title="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice Waveform Visualizer Bar */}
        <div className="px-5 py-3 bg-[#1E293B] border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 h-5">
              {[1, 2, 3, 4, 5, 6].map((bar) => (
                <div
                  key={bar}
                  className={`w-1 rounded-full bg-sky-400 transition-all duration-300 ${
                    isListening || isSpeaking
                      ? 'animate-bounce h-5'
                      : isThinking
                      ? 'animate-pulse h-3'
                      : 'h-1.5 opacity-60'
                  }`}
                  style={{ animationDelay: `${bar * 120}ms` }}
                />
              ))}
            </div>

            <span className="text-xs font-semibold text-slate-300">
              {isListening ? t.listening : isThinking ? t.thinking : isSpeaking ? t.speaking : 'Voice or text enabled'}
            </span>
          </div>

          <button
            onClick={toggleListening}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md'
                : 'bg-sky-600 text-white hover:bg-sky-500'
            }`}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isListening ? 'Stop' : 'Voice Command'}</span>
          </button>
        </div>

        {/* Messages List Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#0B0F19]">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser ? 'bg-sky-600 text-white' : 'bg-[#1E293B] text-sky-400 border border-[#334155]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] p-4 rounded-2xl text-xs leading-relaxed space-y-2 shadow-xs ${
                    isUser
                      ? 'bg-sky-600 text-white rounded-tr-none font-bold'
                      : 'bg-[#1E293B] border border-[#334155] text-slate-100 rounded-tl-none font-medium'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Render Tool Action Confirmation Card */}
                  {msg.toolCall && (
                    <div className="p-2.5 rounded-xl bg-[#0F172A] border border-sky-500/40 text-[11px] text-sky-400 space-y-1 font-mono">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Action Executed: {msg.toolCall.toolName}</span>
                      </div>
                      {msg.toolCall.params && Object.keys(msg.toolCall.params).length > 0 && (
                        <span className="block text-slate-400 text-[10px]">
                          Params: {JSON.stringify(msg.toolCall.params)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#1E293B] border border-[#334155] text-sky-400 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1E293B] border border-[#334155] text-xs text-slate-300 rounded-tl-none font-medium">
                Aura analyzing clinical records...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2.5 border-t border-[#1E293B] flex items-center gap-2 overflow-x-auto custom-scrollbar bg-[#0F172A]">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] font-bold text-[11px] whitespace-nowrap transition-all shadow-xs shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Text Input Bar */}
        <div className="p-4 border-t border-[#1E293B] bg-[#0F172A] flex items-center gap-2">
          <div className="bg-[#1E293B] p-2 rounded-2xl flex items-center border border-[#334155] flex-1">
            <input
              type="text"
              placeholder="Ask Aura anything about your health..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="bg-transparent border-none flex-1 text-xs focus:outline-none text-white placeholder-slate-400 px-2 font-medium"
            />
            <button
              onClick={() => handleSend()}
              className="bg-sky-600 hover:bg-sky-500 text-white p-2.5 rounded-xl transition-all shadow-xs shrink-0 font-bold"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
