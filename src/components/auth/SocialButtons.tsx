'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SiGithub, SiGoogle } from "react-icons/si";
import { signIn } from '@/lib/auth/auth-client';

export const SocialButtons = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setLoading(provider);
    try {
      await signIn.social({
        provider,
        callbackURL: '/profile',
      });
    } catch {
      toast.error(`${provider} sign in failed`);
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={() => handleSocialSignIn('google')}
        disabled={!!loading}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-[3px] cursor-pointer press-brutal disabled:opacity-50"
        style={{ background: 'white', border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)', color: 'var(--brand-ink)' }}
      >
        {loading === 'google' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <SiGoogle className="w-5 h-5" />
        )}
        <span>Google</span>
      </button>

      <button
        onClick={() => handleSocialSignIn('github')}
        disabled={!!loading}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-[3px] cursor-pointer press-brutal disabled:opacity-50"
        style={{ background: 'white', border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)', color: 'var(--brand-ink)' }}
      >
        {loading === 'github' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <SiGithub className="w-5 h-5" />
        )}
        <span>GitHub</span>
      </button>
    </div>
  );
};