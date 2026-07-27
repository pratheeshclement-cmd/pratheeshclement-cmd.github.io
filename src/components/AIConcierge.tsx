import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_AI_MESSAGES, PERSONAL_INFO, PROJECTS, CERTIFICATIONS, WORK_EXPERIENCE, EDUCATION } from '../data/pratheeshData';
import { AIMessage } from '../types';
import { sound } from '../utils/soundEffects';
import { Bot, Send, User, Sparkles, Key, CheckCircle2, RefreshCw } from 'lucide-react';

export const AIConcierge: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Intelligent fallback responder using Pratheesh's verified metadata
  const generateIntelligentResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('summary') || q.includes('who is') || q.includes('overview')) {
      return `**Executive Overview:** Pratheesh Clement is a Results-Driven Web Developer and Digital Technologist based in Vadalur, Tamil Nadu. He holds a **Bachelor of Computer Application (BCA - 2024)** from Pope John Paul II College of Education, a **Google Skillshop Fundamentals of Digital Marketing Certification (Completion ID: 453421024)**, an **HDCA Diploma (Grade A)**, and 1 year of industrial supply chain experience at **Nexteer Automotive** utilizing QAD ERP systems.`;
    }

    if (q.includes('cert') || q.includes('google') || q.includes('marketing') || q.includes('hdca')) {
      return `**Verified Certifications for Pratheesh Clement:**\n1. **Google Digital Garage - Fundamentals of Digital Marketing** (Issued March 2026, ID: 453421024). Covers SEO, SEM, Social Media Marketing, Content Strategy, Google Analytics, & Email Marketing.\n2. **CSC Computer Software College - Honours Diploma in Computer Application (HDCA)** (Issued March 2020, Overall Grade A - Excellent). Covered SQL Server, Visual Basic, HTML/ASP/XML, Tally ERP 9, and Hardware.`;
    }

    if (q.includes('project') || q.includes('expense') || q.includes('app') || q.includes('built')) {
      return `**Featured Project: Expense Management Web Application**\n• **Technologies**: HTML5, CSS3, JavaScript (ES6+), REST APIs, Data Charts.\n• **Key Accomplishments**: Designed full-featured app for tracking personal expenses, implemented secure auth, customizable budget thresholds, real-time data visualizer charts, multi-attribute financial report filtering, and smart budget overflow alerts.`;
    }

    if (q.includes('experience') || q.includes('nexteer') || q.includes('erp') || q.includes('qad') || q.includes('work')) {
      return `**Work Experience: Store Department Associate at Nexteer Automotive Production Company (Mar 2019 – Mar 2020)**\n• Managed production supply chain store operations for a leading tier-1 automotive manufacturer.\n• Utilized QAD ERP enterprise software for real-time stock tracking, material requests, and maintaining 100% audit accuracy.\n• Developed strict process discipline and high-pressure manufacturing problem-solving skills.`;
    }

    if (q.includes('education') || q.includes('degree') || q.includes('college') || q.includes('bca')) {
      return `**Educational Qualifications:**\n• **BCA (Bachelor of Computer Application)** - 2024, Pope John Paul II College of Education, Puducherry.\n• **HSC (Higher Secondary Certificate)** - 2019, Fatima Matriculation HSS.\n• **SSLC (Secondary School Leaving Certificate)** - 2017, S.D. Eaden Matriculation HSS.`;
    }

    if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('seo')) {
      return `**Technical & Marketing Core Skills:**\n• **Web Engineering**: React 19, TypeScript, JavaScript (ES6+), HTML5, CSS3, Vite, REST APIs.\n• **Digital Growth**: Technical SEO, SEM (Google Ads), Google Analytics, Content Marketing, Email Marketing.\n• **Enterprise Systems**: QAD ERP Software, SQL Server, Git/GitHub, VS Code.`;
    }

    if (q.includes('hire') || q.includes('why') || q.includes('role') || q.includes('frontend')) {
      return `**Why Hire Pratheesh Clement?**\nPratheesh combines software engineering craftsmanship (React/TypeScript/HTML5/CSS3) with data-driven Digital Marketing (Google Certified SEO/SEM/Analytics) and industrial ERP process discipline from Nexteer Automotive. He bridges technical front-end execution with strategic business growth.`;
    }

    return `Thank you for your question about Pratheesh Clement. Pratheesh is a BCA Graduate (2024), Google Certified Digital Marketer (ID: 453421024), and Web Developer with React, TypeScript, HTML5/CSS3, and ERP experience. Would you like me to elaborate on his **Expense Management App**, **Google Digital Marketing Certification**, or **Nexteer Automotive ERP Experience**?`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    sound.playClick();

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // If custom API Key provided, attempt Gemini API call
    if (apiKey.trim()) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are the AI Concierge for Pratheesh Clement (MARIYA PRATHEESH C). Answer concisely and professionally based on his resume: BCA 2024 from Pope John Paul II College of Education, Google Digital Marketing Certification ID 453421024, HDCA Grade A, Store Associate at Nexteer Automotive (QAD ERP, 2019-2020), Expense Management Web App (HTML/CSS/JS/REST APIs), skills in React, TypeScript, SEO, SEM, Google Analytics. Question: ${text}`
              }]
            }]
          })
        });

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || generateIntelligentResponse(text);
        
        sound.playTypingSound();
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
        return;
      } catch {
        // Fallback to local intelligence if API call fails
      }
    }

    // Local Smart Response Simulation
    setTimeout(() => {
      sound.playTypingSound();
      const aiText = generateIntelligentResponse(text);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid rgba(127, 0, 255, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #7F00FF 0%, #00F2FE 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(127, 0, 255, 0.4)'
          }}>
            <Bot size={28} color="#FFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                AI DIGITAL CONCIERGE
              </h2>
              <span className="badge badge-violet">NEURAL ENGINE v1.0</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
              Ask anything regarding Pratheesh Clement's skills, Google Certification, BCA degree, or Expense App.
            </p>
          </div>
        </div>

        {/* Gemini Custom Key Field */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <Key size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="password"
              placeholder="Optional Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '6px 10px 6px 30px',
                color: '#FFF',
                fontSize: '0.75rem',
                width: '180px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="glass-panel" style={{
        height: '500px',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Messages List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          paddingRight: '8px',
          marginBottom: '16px'
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: '12px'
              }}
            >
              {msg.sender === 'ai' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7F00FF 0%, #00F2FE 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={18} color="#FFF" />
                </div>
              )}

              <div style={{
                maxWidth: '80%',
                backgroundColor: msg.sender === 'user' 
                  ? 'rgba(0, 242, 254, 0.15)' 
                  : 'rgba(255, 255, 255, 0.04)',
                border: msg.sender === 'user' 
                  ? '1px solid rgba(0, 242, 254, 0.3)' 
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '14px 18px',
                color: '#F8FAFC',
                fontSize: '0.9rem',
                lineHeight: '1.6'
              }}>
                <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '6px', textAlign: 'right' }}>
                  {msg.timestamp}
                </div>

                {/* Quick Action Chips */}
                {msg.actionChips && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    {msg.actionChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip.label)}
                        style={{
                          backgroundColor: 'rgba(0, 242, 254, 0.1)',
                          border: '1px solid rgba(0, 242, 254, 0.25)',
                          color: '#00F2FE',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={18} color="#FFF" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
              <Bot size={20} color="#7F00FF" />
              <span>Concierge is thinking...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: '8px 12px',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <input
            type="text"
            placeholder="Ask about Pratheesh's skills, certifications, projects, or background..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFF',
              fontSize: '0.9rem',
              padding: '6px'
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            className="btn-primary"
            style={{ padding: '8px 16px', borderRadius: '10px' }}
          >
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};
