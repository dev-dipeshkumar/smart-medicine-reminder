'use client';

import React, { useState, useRef, useEffect } from 'react';
import api from '@/utils/api';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Lightbulb,
  Pill,
  Heart,
  Activity,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

const quickQuestions = [
  { icon: Pill, text: 'What should I do if I miss a dose?', query: 'What should I do if I miss a dose?' },
  { icon: Heart, text: 'Tips for heart health', query: 'Give me tips for heart health' },
  { icon: Activity, text: 'Common medicine side effects', query: 'What are common medicine side effects?' },
  { icon: Lightbulb, text: 'How to store medicines?', query: 'How should I store my medicines?' },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: "Hello! I'm your AI Health Assistant. I can help you with:\n\n• Medicine information and tips\n• General health advice\n• Dosage reminders\n• Side effect information\n\nWhat would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/ai-assistant', { question: userMessage });
      setMessages(prev => [...prev, { type: 'bot', content: response.data.answer }]);
    } catch {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "I'm sorry, I couldn't process your question. Please try again or consult your healthcare provider for specific medical advice."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex flex-col max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">AI Health Assistant</h1>
          <p className="text-gray-500 mt-1">Get instant answers to your health questions</p>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col border-gray-100">
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' ? 'bg-[#e0f2fe]' : 'bg-gradient-to-br from-purple-500 to-[#0284c7]'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-5 h-5 text-[#0284c7]" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-[#0284c7] text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-[#0284c7] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            {messages.length < 3 && (
              <div className="px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Quick Questions
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {quickQuestions.map((q, index) => {
                    const Icon = q.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInput(q.query)}
                        className="flex items-center gap-2 whitespace-nowrap border-[#e0f2fe] text-[#0284c7] hover:bg-[#e0f2fe]"
                      >
                        <Icon className="w-4 h-4" />
                        {q.text}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-100">
              <div className="flex gap-3">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about medicines, health tips, or symptoms..."
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !input.trim()} className="bg-[#0284c7] hover:bg-[#0369a1]">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="mt-4 bg-yellow-50 border-yellow-200">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            This AI assistant provides general information only. Always consult your healthcare provider
            for specific medical advice, diagnosis, or treatment.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
}
