'use client';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from '@/components/auth/auth-provider';
import { useEffect, useState } from 'react';
import { Banknote, Mail } from "lucide-react";
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'sonner';

// Microsoft blue four-square logo (no wordmark)
function MicrosoftIcon({ className = "" }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="9" height="9" fill="#0078D4"/>
      <rect x="13" y="2" width="9" height="9" fill="#0078D4"/>
      <rect x="2" y="13" width="9" height="9" fill="#0078D4"/>
      <rect x="13" y="13" width="9" height="9" fill="#0078D4"/>
    </svg>
  );
}

const QUOTES = [
  {
    id: 1,
    text: "Global Remit made it so easy to support my family abroad. I feel secure and valued every step of the way.",
    author: "Maria, Customer"
  },
  {
    id: 2,
    text: "The interface is so intuitive, I can process transactions in seconds. It feels like using a native iOS app.",
    author: "Alex R., Operations Manager"
  },
  {
    id: 3,
    text: "I love the security and transparency. Global Remit is the gold standard for international transfers.",
    author: "Sam T., Branch Teller"
  }
];

export default function LoginPage() {
  const { user, loading, loginWithCredentials, loginWithMicrosoft } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingInWithMicrosoft, setIsLoggingInWithMicrosoft] = useState(false);

  // Quote rotator
  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((idx) => (idx + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await loginWithCredentials(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      toast.error(err instanceof Error ? err.message : 'Failed to login');
    }
  };
  
  const handleMicrosoftLogin = async () => {
    setError(null);
    setIsLoggingInWithMicrosoft(true);
    
    try {
      await loginWithMicrosoft();
      // No need to redirect here as the Microsoft login will handle the redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login with Microsoft');
      toast.error(err instanceof Error ? err.message : 'Failed to login with Microsoft');
      setIsLoggingInWithMicrosoft(false);
    }
  };
  
  // Development mode login handler
  const handleDevLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Use the teller account credentials
      await loginWithCredentials('teller@globalremit.com', 'password');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login with dev account');
      toast.error(err instanceof Error ? err.message : 'Failed to login with dev account');
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-[#F5F5F7] to-[#E5E5EA] dark:from-gray-900 dark:to-gray-800 pt-8 sm:pt-20 font-['-apple-system','BlinkMacSystemFont','SF Pro Text',sans-serif]">
      <div className="flex flex-col md:flex-row w-full max-w-5xl md:rounded-2xl rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden bg-white/0 md:min-h-[350px] min-h-[55vh] mx-4">
        {/* Left: Blue Panel */}
        <div className="flex-1 bg-gradient-to-br from-[#0A84FF] to-[#007AFF] text-white flex flex-col justify-between p-4 sm:p-8 md:p-14 relative md:rounded-none rounded-t-xl md:rounded-l-3xl shadow-[0_8px_32px_0_rgba(10,132,255,0.1)] backdrop-blur-sm">
          {/* Top: Logo, Motto, Description */}
          <div>
            <div className="flex items-center gap-3 mb-10 transition-all duration-200 hover:scale-105">
              <div className="relative inline-block transition-transform duration-200">
                <img src="/app-logo.png" alt="Global Remit Logo" className="h-12 w-auto max-w-[96px]" />
              </div>
              <span className="font-bold text-2xl tracking-tight">Global Remit</span>
            </div>
            <div className="text-lg font-semibold mb-2">Beyond Banking</div>
            <div className="text-sm text-white/80">Fast, secure international money transfers</div>
            <div className="text-base opacity-90 mb-8 max-w-md">
              Your trusted partner for fast, secure international money transfers with competitive rates and robust compliance.
            </div>
          </div>
          {/* Bottom: Animated Inspiring Quote */}
          <div className="mt-10 min-h-[90px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={QUOTES[quoteIdx].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="italic text-white/70 text-base sm:text-lg"
              >
                “{QUOTES[quoteIdx].text}”
                <div className="mt-2 text-sm font-semibold opacity-80 not-italic">— {QUOTES[quoteIdx].author}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {/* Right: Login Form */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:px-8 sm:py-12 md:px-12 md:py-14 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="w-full max-w-md mx-auto p-4 sm:p-8 md:p-10 flex flex-col gap-10 transition-all duration-200 relative">
            {/* Top divider only (no logo) */}
            <div className="flex flex-col items-center gap-2 mb-2">
              <span className="block w-10 h-1 rounded-full bg-gray-200/70 dark:bg-gray-700/70 mb-2" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Welcome Back</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">Sign in to your account</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="w-full h-14 px-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/40 transition-all text-base font-medium placeholder-gray-400 dark:placeholder-gray-500 hover:border-gray-300 dark:hover:border-gray-600 dark:text-white"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className="w-full h-14 px-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/40 transition-all text-base font-medium placeholder-gray-400 dark:placeholder-gray-500 hover:border-gray-300 dark:hover:border-gray-600 dark:text-white"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <Link href="/reset-password" className="text-xs text-blue-500 dark:text-blue-400 hover:underline transition">Forgot password?</Link>
                </div>
              </div>
              {error && (
                <div className="py-2 px-3 rounded text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-center">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full h-14 bg-[#007AFF] hover:bg-[#0066CC] text-white rounded-xl font-semibold text-base transition-colors flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Sign In with Email
                  </span>
                )}
              </Button>
              
              {/* Microsoft SSO Login Button */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Button
                type="button"
                onClick={handleMicrosoftLogin}
                className="w-full h-14 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-base transition-colors flex items-center justify-center gap-2"
                disabled={loading || isLoggingInWithMicrosoft}
              >
                {isLoggingInWithMicrosoft ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
                    Connecting to Microsoft...
                  </span>
                ) : (
                  <>
                    <MicrosoftIcon className="h-5 w-5" />
                    Sign in with Microsoft
                  </>
                )}
              </Button>
              {/* Development mode login button */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  type="button"
                  onClick={handleDevLogin}
                  className="mt-4 w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    'DEV MODE: Login as Teller'
                  )}
                </Button>
              )}
            </form>
            {/* Footer */}
            <div className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
              <span className="text-[10px] text-gray-300 dark:text-gray-600"> {new Date().getFullYear()} Global Remit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}