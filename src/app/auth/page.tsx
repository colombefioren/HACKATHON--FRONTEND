'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInForm } from '@/components/auth/SignInForm';
import Link from 'next/link';
import { SocialButtons } from '@/components/auth/SocialButtons';
import { SignUpForm } from '@/components/auth/SignUpForm';

const COLORS = {
  primary: '#a089df',
  secondary: '#807be4',
};

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuthSuccess = () => {
    window.location.href = '/';
  };

  return (
    <div className="h-screen w-screen overflow-hidden" style={{ background: '#181136' }}>
      <div className="aurora" />
      <div className="noise" />
      
      <div className="relative z-10 h-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm px-6"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 w-fit">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: COLORS.primary }}>
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>
              {isSignUp ? 'Create account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-slate-400" style={{ fontFamily: 'var(--font-jakarta)' }}>
              {isSignUp ? 'Start your journey with us' : 'Enter your credentials to continue'}
            </p>
          </div>

          {/* Form */}
          <div className="glass rounded-2xl p-6 gradient-line">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? 'signup' : 'signin'}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {isSignUp ? (
                  <SignUpForm onSuccess={handleAuthSuccess} />
                ) : (
                  <SignInForm onSuccess={handleAuthSuccess} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-slate-500 uppercase" style={{ fontFamily: 'var(--font-jakarta)' }}>or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social Buttons */}
            <SocialButtons />
          </div>

          {/* Toggle */}
          <div className="mt-5 text-center">
            <p className="text-slate-400 text-xs" style={{ fontFamily: 'var(--font-jakarta)' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium hover:opacity-80 transition-opacity cursor-pointer" style={{ color: COLORS.primary }}>
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          <p className="mt-4 text-center text-slate-500 text-[10px]">
            By continuing, you agree to our Terms of Service
          </p>
        </motion.div>
      </div>
    </div>
  );
}