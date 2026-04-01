import React, { useState } from 'react';
import { Mail, Lock, LogIn, Chrome } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { toast } from 'sonner';

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Signed in successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in with Google!');
    } catch (error: any) {
      toast.error(error.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30 flex items-center justify-center overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="z-10 w-full max-w-md p-8 md:p-10 bg-surface/80 backdrop-blur-xl rounded-3xl border border-outline/30 shadow-2xl relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl"></div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-inner">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-on-surface mb-2">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-on-surface-variant font-medium">
            {isSignUp ? 'Sign up to access the Watergenic Platform' : 'Sign in to access the Watergenic Platform'}
          </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-background/50 border border-outline/50 rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background/50 border border-outline/50 rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-on-primary py-3 rounded-xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              isSignUp ? 'Sign Up' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px bg-outline/50 flex-1"></div>
          <span className="text-sm text-on-surface-variant font-medium">OR</span>
          <div className="h-px bg-outline/50 flex-1"></div>
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="mt-6 w-full bg-surface border border-outline hover:bg-surface-variant text-on-surface py-3 rounded-xl font-semibold transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <Chrome className="w-5 h-5" />
          Sign in with Google
        </button>

        <p className="mt-8 text-center text-on-surface-variant text-sm font-medium">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-bold hover:underline underline-offset-4"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
