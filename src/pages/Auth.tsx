import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Activity, ShieldCheck, Github, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthProps {
    onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Auth submission:', { email, password, name, type: isLogin ? 'login' : 'signup' });
        onLogin();
    };

    return (
        <div className="auth-container">
            <div className="auth-visual md:flex hidden">
                <div className="visual-content">
                    <Activity size={48} className="visual-icon" />
                    <h1>Join DiabetesCare</h1>
                    <p>Your companion for a healthier, more balanced life with diabetes. Track, analyze, and improve every day.</p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <ShieldCheck size={20} />
                            <span>Secure, encrypted data storage</span>
                        </div>
                        <div className="feature-item">
                            <Activity size={20} />
                            <span>Personalized health analytics</span>
                        </div>
                    </div>
                </div>
                <div className="bg-pattern"></div>
            </div>

            <div className="auth-form-side">
                <div className="auth-card glass animate-fade-in">
                    <div className="form-header">
                        <Activity className="md:hidden text-blue-primary mb-4" size={32} />
                        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                        <p className="text-muted">
                            {isLogin ? 'Enter your details to access your dashboard' : 'Start your journey to better health today'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="form-group"
                                >
                                    <label>Full Name</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <User className="input-icon" size={20} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="form-group"
                        >
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Mail className="input-icon" size={20} />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="form-group"
                        >
                            <div className="label-row">
                                <label>Password</label>
                                {isLogin && <a href="#" className="forgot-link">Forgot?</a>}
                            </div>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Lock className="input-icon" size={20} />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.button
                            type="submit"
                            className="btn btn-primary w-full mt-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span>{isLogin ? 'Sign In' : 'Get Started'}</span>
                            <ArrowRight size={18} />
                        </motion.button>
                    </form>

                    <div className="divider">
                        <span>or continue with</span>
                    </div>

                    <div className="social-login">
                        <button className="social-btn"><Github size={20} /> Github</button>
                        <button className="social-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                    </div>

                    <p className="auth-footer">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>

            <style>{`
        .auth-container { display: flex; min-height: 100vh; background: var(--bg-app); }
        
        .auth-visual { 
          flex: 1.2; background: var(--blue-primary); position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; color: white; padding: 60px;
        }
        .visual-content { position: relative; z-index: 2; max-width: 480px; }
        .visual-icon { margin-bottom: 24px; color: hsla(200, 85%, 90%, 0.9); }
        .auth-visual h1 { color: white; font-size: 3rem; margin-bottom: 20px; line-height: 1.2; }
        .auth-visual p { font-size: 1.1rem; opacity: 0.9; line-height: 1.6; }
        
        .feature-list { margin-top: 40px; display: flex; flex-direction: column; gap: 16px; }
        .feature-item { display: flex; align-items: center; gap: 12px; font-weight: 500; }
        
        .bg-pattern {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background-image: radial-gradient(circle at 2px 2px, hsla(200, 85%, 40%, 0.3) 1px, transparent 0);
          background-size: 32px 32px;
        }

        .auth-form-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .auth-card { 
          width: 100%; max-width: 440px; padding: 40px; 
          border-radius: var(--radius-lg);
          background: white;
          box-shadow: var(--shadow-lg);
        }
        
        .form-header { margin-bottom: 32px; }
        .form-header h2 { font-size: 2rem; margin-bottom: 8px; letter-spacing: -0.02em; }
        
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--text-main); margin-bottom: 8px; }
        
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-wrapper input {
          width: 100%; padding: 14px 16px 14px 48px;
          background: hsl(210, 30%, 99%);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: var(--text-main);
          transition: all 0.2s ease;
        }
        .input-wrapper input::placeholder { color: hsla(210, 20%, 45%, 0.5); }
        .input-wrapper input:focus {
          background: white;
          border-color: var(--blue-primary);
          outline: none;
          box-shadow: 0 0 0 4px hsla(200, 85%, 60%, 0.15);
          transform: translateY(-1px);
        }
        
        .input-icon {
          position: absolute; left: 16px; color: var(--text-muted);
          transition: all 0.2s ease; pointer-events: none;
        }
        .input-wrapper input:focus + .input-icon { color: var(--blue-primary); }

        .password-toggle {
          position: absolute; right: 12px; background: none; border: none;
          color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
        }
        .password-toggle:hover { color: var(--blue-primary); background: var(--blue-soft); }

        .label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .forgot-link { font-size: 0.8rem; color: var(--blue-primary); text-decoration: none; font-weight: 600; }

        .divider { 
          display: flex; align-items: center; text-align: center; margin: 32px 0; 
          color: var(--text-muted); font-size: 0.8rem; 
        }
        .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid var(--border-color); }
        .divider span { padding: 0 16px; }

        .social-login { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .social-btn { 
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-md);
          background: white; cursor: pointer; font-weight: 600; transition: 0.2s;
        }
        .social-btn:hover { background: var(--bg-app); border-color: var(--text-muted); }

        .auth-footer { text-align: center; margin-top: 32px; font-size: 0.9rem; color: var(--text-muted); }
        .toggle-btn { 
          background: none; border: none; color: var(--blue-primary); font-weight: 700; 
          cursor: pointer; margin-left: 6px; padding: 0; font-size: 1rem;
        }

        @media (max-width: 768px) {
          .auth-form-side { padding: 20px; }
          .auth-card { padding: 32px 24px; box-shadow: none; border: none; background: transparent; }
          .hidden.md\\:flex { display: none; }
        }
        .mt-4 { margin-top: 1rem; }
        .mb-4 { margin-bottom: 1rem; }
        .w-full { width: 100%; }
        .md\\:hidden { display: none; }
        @media (max-width: 767px) {
          .md\\:hidden { display: block; }
        }
      `}</style>
        </div>
    );
};

export default Auth;
