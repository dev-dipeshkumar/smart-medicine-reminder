'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Loading animation duration - no auth redirects on landing page
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1400);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <>
      {/* Loading Screen with Logo Animation */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ease-out ${
          isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(135deg, #26A69A 0%, #4DD0E1 50%, #80DEEA 100%)',
        }}
      >
        <div className="flex flex-col items-center">
          {/* Logo Container with pulse animation */}
          <div className="relative">
            {/* Outer ring animation */}
            <div className="absolute inset-0 rounded-3xl bg-white/20 animate-ping" style={{ animationDuration: '1.5s' }} />
            
            {/* Logo box */}
            <div className="relative w-24 h-24 rounded-3xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-2xl">
              <HeartPulse className="w-12 h-12 text-white animate-pulse" />
            </div>
            
            {/* Inner glow */}
            <div className="absolute inset-2 rounded-2xl bg-white/10" />
          </div>
          
          {/* Brand name with fade in */}
          <h1 
            className="mt-8 text-3xl font-bold text-white tracking-wide"
            style={{ 
              animation: 'fadeInUp 0.5s ease-out forwards',
              animationDelay: '0.3s',
              opacity: 0,
            }}
          >
            MediCare
          </h1>
          
          {/* Tagline */}
          <p 
            className="mt-3 text-white/80 text-sm"
            style={{ 
              animation: 'fadeInUp 0.5s ease-out forwards',
              animationDelay: '0.5s',
              opacity: 0,
            }}
          >
            AI-Powered Medicine Reminder
          </p>
          
          {/* Loading dots */}
          <div className="mt-8 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-white"
                style={{
                  animation: 'bounce 1.4s infinite ease-in-out',
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Landing Page */}
      <div 
        className={`min-h-screen transition-all duration-1000 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Background with Blur and Gradient */}
        <div className="fixed inset-0 z-0">
          {/* Base gradient */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #26A69A 0%, #4DD0E1 40%, #80DEEA 100%)',
            }}
          />
          
          {/* Decorative blurred circles */}
          <div 
            className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(77, 208, 225, 0.4) 0%, transparent 70%)',
              transform: 'translate(-30%, -30%)',
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(38, 166, 154, 0.3) 0%, transparent 70%)',
              transform: 'translate(30%, 30%)',
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(128, 222, 234, 0.3) 0%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
            }}
          />
          
          {/* Overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-teal-900/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header 
            className={`w-full px-6 py-4 flex items-center justify-between transition-all duration-700 ease-out ${
              showContent ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-105">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">MediCare</span>
            </Link>
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20 hover:text-white font-medium px-5"
              >
                Sign In
              </Button>
            </Link>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-6 py-8 lg:py-12 flex items-center">
            <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              
              {/* Left Side - Hero */}
              <div 
                className={`space-y-8 transition-all duration-700 ease-out ${
                  showContent ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    <span className="block">Smart Medicine</span>
                    <span className="block text-cyan-100">Reminders for a</span>
                    <span className="block">Healthier Life</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-white/85 max-w-lg leading-relaxed">
                    The AI Medicine Reminder System helps users manage their medicines easily and never miss a dose. 
                    Stay on track with your health journey.
                  </p>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: '✓', text: 'Smart Reminders' },
                    { icon: '✓', text: 'AI Assistant' },
                    { icon: '✓', text: 'Emergency Help' },
                  ].map((feature, index) => (
                    <div
                      key={feature.text}
                      className={`flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full text-white font-medium transition-all duration-500 hover:bg-white/25 cursor-default ${
                        showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                      style={{ transitionDelay: `${400 + index * 100}ms` }}
                    >
                      <span className="text-green-300 text-lg">{feature.icon}</span>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Statistics */}
                <div 
                  className={`grid grid-cols-3 gap-8 pt-6 border-t border-white/20 transition-all duration-700 ${
                    showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: '600ms' }}
                >
                  {[
                    { value: '50K+', label: 'Active Users' },
                    { value: '99%', label: 'Satisfaction' },
                    { value: '4.9', label: 'App Rating' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center lg:text-left">
                      <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/70 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div 
                  className={`flex flex-wrap gap-4 pt-2 transition-all duration-700 ${
                    showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: '700ms' }}
                >
                  <Link href="/signup">
                    <Button 
                      size="lg"
                      className="bg-white text-teal-600 hover:bg-white/90 font-semibold px-8 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button 
                      size="lg"
                      variant="outline" 
                      className="border-white/40 text-white hover:bg-white/10 hover:text-white hover:border-white/60 font-medium px-8 h-12 rounded-xl transition-all"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Side - Preview Card */}
              <div 
                className={`flex justify-center lg:justify-end transition-all duration-700 ease-out ${
                  showContent ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="w-full max-w-md">
                  {/* Floating Preview Card */}
                  <div className="relative">
                    {/* Card glow effect */}
                    <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl" />
                    
                    {/* Main Card */}
                    <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
                      {/* Card Header */}
                      <div className="p-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <HeartPulse className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">Welcome to MediCare</h3>
                            <p className="text-white/80 text-sm">Your health companion</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="p-6 space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                              <span className="text-lg">💊</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Medicine Reminders</p>
                              <p className="text-sm text-gray-500">Never miss a dose</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                              <span className="text-lg">🤖</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">AI Health Assistant</p>
                              <p className="text-sm text-gray-500">Get instant health tips</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                              <span className="text-lg">🚨</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Emergency Support</p>
                              <p className="text-sm text-gray-500">Quick access to help</p>
                            </div>
                          </div>
                        </div>
                        
                        <Link href="/signup" className="block">
                          <Button 
                            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all"
                          >
                            Create Free Account
                          </Button>
                        </Link>
                        
                        <p className="text-center text-sm text-gray-500">
                          Already have an account?{' '}
                          <Link href="/login" className="text-teal-600 font-medium hover:text-teal-700">
                            Sign in
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer 
            className={`px-6 py-4 text-center text-white/60 text-sm transition-all duration-700 ${
              showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <p>© 2024 MediCare. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
}
