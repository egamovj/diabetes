import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Activity, ShieldCheck, Github, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    sendPasswordResetEmail
} from 'firebase/auth';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '../contexts/LanguageContext';

const Auth: React.FC = () => {
    const { t } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (name) {
                    await updateProfile(userCredential.user, { displayName: name });
                    window.location.reload();
                }
            }
        } catch (err: any) {
            setError(err.message || t('auth_error') || 'An error occurred during authentication');
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: any) => {
        setError('');
        setLoading(true);
        try {
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            setError(err.message || t('social_failed') || 'Social login failed');
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError(t('enter_email_first') || 'Please enter your email address first');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert(t('reset_sent') || 'Password reset email sent! Please check your inbox.');
        } catch (err: any) {
            setError(err.message || t('reset_failed') || 'Failed to send reset email');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#fafcfb] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px] -z-0 animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-teal-100/20 rounded-full blur-[120px] -z-0"></div>

            {/* Visual Side */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 relative overflow-hidden items-center justify-center p-20 text-white z-10 shadow-[20px_0_100px_rgba(0,0,0,0.1)]">
                <div className="relative z-20 max-w-lg space-y-12">
                    <div className="space-y-6">
                        <div className="h-20 w-20 rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl animate-bounce-slow">
                            <Activity size={40} className="text-emerald-200" />
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter leading-none font-outfit uppercase italic">
                            {t('metabolic_unity').split(' ')[0]} <br /> <span className="text-emerald-300">{t('metabolic_unity').split(' ')[1]}</span>
                        </h1>
                        <p className="text-xl text-emerald-50/80 font-medium leading-relaxed max-w-md">
                            {t('harmonizing_desc')}
                        </p>
                    </div>

                    <div className="space-y-8 pt-6">
                        <div className="flex items-center gap-6 group">
                            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all shadow-lg">
                                <ShieldCheck size={28} className="text-emerald-300" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black uppercase tracking-widest text-[10px] text-emerald-200">{t('encryption_level')}</h4>
                                <p className="text-lg font-bold">{t('biometric_vault')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all shadow-lg">
                                <Activity size={28} className="text-emerald-300" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black uppercase tracking-widest text-[10px] text-emerald-200">{t('analytical_depth')}</h4>
                                <p className="text-lg font-bold">{t('glycemic_insight')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Abstract Orbs */}
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-teal-400/10 rounded-full blur-[60px]"></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 backdrop-blur-sm">
                <Card className="w-full max-w-lg border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 bg-white/90 backdrop-blur-2xl rounded-[48px] border-t border-white">
                    <CardHeader className="space-y-3 pb-8 pt-10 px-10 text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="h-16 w-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                                <Activity size={32} />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                            <div className="h-1 bg-emerald-500 w-12 rounded-full"></div>
                            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 font-black uppercase tracking-widest text-[10px] px-3">{t('system_access')}</Badge>
                        </div>
                        <CardTitle className="text-5xl font-black tracking-tight text-slate-900 font-outfit uppercase italic leading-none">
                            {isLogin ? t('initialize') : t('register')}
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-medium text-lg pt-1">
                            {isLogin ? t('auth_credentials') : t('create_profile')}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 px-10 pb-8">
                        {error && (
                            <div className="bg-red-50/50 backdrop-blur-md text-red-600 p-5 rounded-3xl text-[11px] font-black uppercase tracking-widest border border-red-100 shadow-sm animate-in zoom-in duration-300">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AnimatePresence mode="wait">
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <Label htmlFor="name" className="text-slate-500 font-black ml-1 uppercase text-[10px] tracking-[0.2em]">{t('full_name')}</Label>
                                        <div className="relative group/input">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-600 transition-colors" size={18} />
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="John Doe"
                                                className="h-12 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[6px] focus:ring-emerald-500/10 transition-all font-bold border-2"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-500 font-black ml-1 uppercase text-[10px] tracking-[0.2em]">{t('email_address')}</Label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-600 transition-colors" size={18} />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="h-12 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[6px] focus:ring-emerald-500/10 transition-all font-bold border-2"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <Label htmlFor="password" className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">{t('access_password')}</Label>
                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            className="text-[10px] font-black underline uppercase text-emerald-600 hover:text-emerald-700 tracking-widest"
                                        >
                                            {t('forgot_token')}
                                        </button>
                                    )}
                                </div>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-600 transition-colors" size={18} />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="px-12 h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[6px] focus:ring-emerald-500/10 transition-all font-bold border-2"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-16 rounded-[24px] text-base font-black bg-emerald-600 hover:bg-emerald-700 shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)] active:scale-[0.98] transition-all gap-3 py-6 group/btn relative overflow-hidden italic uppercase"
                                disabled={loading}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    {loading ? t('processing') : (isLogin ? t('gain_access') : t('establish_profile'))}
                                    {!loading && <ArrowRight className="animate-pulse" size={20} />}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                            </Button>
                        </form>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-100" />
                            </div>
                            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.4em] text-slate-300">
                                <span className="bg-white/90 px-4">{t('social_interface')}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                                onClick={() => handleSocialLogin(githubProvider)}
                                disabled={loading}
                            >
                                <Github className="mr-3" size={16} /> Github
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                                onClick={() => handleSocialLogin(googleProvider)}
                                disabled={loading}
                            >
                                <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#10b981" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#059669" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#34d399" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#065f46" />
                                </svg>
                                Google
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className="justify-center pb-10 pt-0">
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                            {isLogin ? t('new_to_system') : t('return_to_protocol')}
                            <button
                                className="ml-2 text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 underline-offset-4"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? t('open_account') : t('identify_status')}
                            </button>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Auth;
