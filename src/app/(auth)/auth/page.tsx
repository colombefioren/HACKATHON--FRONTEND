'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInForm } from '@/components/auth/SignInForm';
import { SocialButtons } from '@/components/auth/SocialButtons';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuthSuccess = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
_      <div className="px-4 sm:px-7 py-6 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
    

          {/* Form Card */}
          <div
            className="bg-card rounded-lg p-6 mb-4"
            style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '5px 5px 0 var(--brand-ink)' }}
          >
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
              <div className="flex-1 h-px" style={{ background: 'var(--brand-ink)' }} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">or continue with</span>
              <div className="flex-1 h-px" style={{ background: 'var(--brand-ink)' }} />
            </div>

            {/* Social Buttons */}
            <SocialButtons />
          </div>

          {/* Toggle */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium underline cursor-pointer"
                style={{ color: 'var(--brand-ink)' }}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}