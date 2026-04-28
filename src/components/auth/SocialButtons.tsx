'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SiGithub, SiGoogle } from "react-icons/si";
import {} from "lucide-react"
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
    <div className="relative flex items-center gap-3">      
      <div className="flex gap-2 w-full">
        <Button
          variant="outline"
          onClick={() => handleSocialSignIn('google')}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {loading === 'google' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
       <SiGoogle className="w-5 h-5" />
          )}
          <span className="text-sm">Google</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleSocialSignIn('github')}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {loading === 'github' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
         <SiGithub className="w-5 h-5" />
          )}
          <span className="text-sm">GitHub</span>
        </Button>
      </div>
    </div>
  );
};