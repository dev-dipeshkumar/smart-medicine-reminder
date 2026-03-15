'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import { 
  HeartPulse, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Phone,
  Calendar,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Social Icons as components
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7## C1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Loading animation
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1700);

    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    }

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(contentTimer);
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (authMode === 'signup') {
        await api.post('/auth/signup', {
          name,
          email,
          password,
          age: age ? parseInt(age) : null,
          phone: phone || null,
        });
        setAuthMode('signin');
        setError('');
        alert('Account created! Please sign in.');
      } else {
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.access_token);
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Loading Screen */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-teal-400 to-cyan-500 transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
              <HeartPulse className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-white/30 animate-ping" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-white">MediCare</h1>
          <p className="mt-2 text-white/80 text-sm">AI-Powered Medicine Reminder</p>
          
          {/* Loading dots */}
          <div className="mt-6 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`min-h-screen transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* Background with blur effect */}
        <div className="fixed inset-0 z-0">
          {/* Background image placeholder with blur */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 900'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2326A69A'/%3E%3Cstop offset='50%25' stop-color='%234DD0E1'/%3E%3Cstop offset='100%25' stop-color='%2380DEEA'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='1440' height='900'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-teal-500/80 via-cyan-500/70 to-teal-400/80" />
          
          {/* Decorative circles */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen">
          {/* Header */}
          <header className={`w-full px-6 py-4 flex items-center justify-between transition-all duration-700 ${showContent ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MediCare</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
                Dashboard
              </Button>
            </Link>
          </header>

          {/* Main Split Layout */}
          <main className="container mx-auto px-6 py-8 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Side - Hero Content */}
              <div className={`space-y-8 transition-all duration-700 delay-200 ${showContent ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Smart Medicine{' '}
                    <span className="block text-cyan-100">Reminders</span>
                    <span className="block text-2xl md:text-3xl lg:text-4xl font-normal text-white/90 mt-2">
                      for a Healthier Life
                    </span>
                  </h1>
                  <p className="text-lg text-white/80 max-w-lg">
                    The AI Medicine Reminder System helps users manage their medicines easily and never miss a dose. 
                    Stay on track with your health journey.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: CheckCircle, text: 'Smart Reminders' },
                    { icon: CheckCircle, text: 'AI Assistant' },
                    { icon: CheckCircle, text: 'Emergency Help' },
                  ].map((feature, index) => (
                    <div 
                      key={feature.text}
                      className={`flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-500 delay-[${300 + index * 100}ms] ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                      style={{ transitionDelay: `${300 + index * 100}ms` }}
                    >
                      <feature.icon className="w-5 h-5 text-green-300" />
                      <span className="font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className={`grid grid-cols-3 gap-6 pt-4 transition-all duration-700 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  {[
                    { value: '50K+', label: 'Active Users' },
                    { value: '99%', label: 'Satisfaction' },
                    { value: '4.9', label: 'App Rating' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Auth Card */}
              <div className={`flex justify-center lg:justify-end transition-all duration-700 delay-300 ${showContent ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                <div className="w-full max-w-md">
                  {/* Auth Card */}
                  <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
                    {/* Card Header */}
                    <div className="p-6 pb-0">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
                      </h2>
                      <p className="text-gray-500 mt-1">
                        {authMode === 'signin' 
                          ? 'Sign in to continue your health journey' 
                          : 'Start your health journey today'}
                      </p>
                    </div>

                    {/* Auth Toggle */}
                    <div className="px-6 pt-4">
                      <div className="flex bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() => setAuthMode('signin')}
                          className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                            authMode === 'signin'
                              ? 'bg-white text-teal-600 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => setAuthMode('signup')}
                          className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                            authMode === 'signup'
                              ? 'bg-white text-teal-600 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                      {error && (
                        <Alert variant="destructive" className="animate-shake">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {authMode === 'signup' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative mt-1.5">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10"
                                placeholder="Enter your name"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="age">Age</Label>
                              <div className="relative mt-1.5">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  id="age"
                                  type="number"
                                  value={age}
                                  onChange={(e) => setAge(e.target.value)}
                                  className="pl-9"
                                  placeholder="Age"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone</Label>
                              <div className="relative mt-1.5">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  id="phone"
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  className="pl-9"
                                  placeholder="Phone"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative mt-1.5">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative mt-1.5">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10"
                            placeholder="Enter your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {authMode === 'signin' && (
                        <div className="flex items-center justify-between text-sm">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" />
                            <span className="text-gray-600">Remember me</span>
                          </label>
                          <Link href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                            Forgot password?
                          </Link>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </Button>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white text-gray-500">or continue with</span>
                        </div>
                      </div>

                      {/* Social Login */}
                      <div className="flex justify-center gap-4">
                        <button
                          type="button"
                          className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                          <GoogleIcon />
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                          <AppleIcon />
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                          <FacebookIcon />
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Bottom text */}
                  <p className="text-center text-white/70 mt-6 text-sm">
                    By continuing, you agree to our{' '}
                    <Link href="#" className="text-white underline hover:no-underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="#" className="text-white underline hover:no-underline">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
