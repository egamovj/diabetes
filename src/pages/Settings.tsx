import React, { useState } from 'react';
import { User, Mail, ShieldCheck, Camera, Save, Activity, CheckCircle2, Lock } from 'lucide-react';
import { auth } from '../config/firebase';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const Settings: React.FC = () => {
    const user = auth.currentUser;
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setMessage(null);
        try {
            await updateProfile(user, { displayName, photoURL });
            setMessage({ type: 'success', text: 'Profile configuration synchronized successfully.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, user.email);
            setMessage({ type: 'success', text: 'Security token reset link dispatched to your inbox.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Background Decorative Element */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-100/20 rounded-full blur-[100px] -z-10"></div>

            <header className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-3">
                    <div className="h-1 bg-emerald-500 w-12 rounded-full"></div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 font-bold uppercase tracking-widest text-[10px] px-3">System Identity</Badge>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 font-outfit uppercase leading-none drop-shadow-sm">
                    Account <span className="text-emerald-600">Calibration</span>
                </h1>
                <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">
                    Personalize your metabolic profile and manage clinical security protocols.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
                {/* Profile Form Area */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-10">
                    <Card className="border-none shadow-[0_32px_64px_-12px_rgba(16,185,129,0.1)] overflow-hidden bg-gradient-to-b from-white to-emerald-50/20 rounded-[40px] group border-t border-white">
                        <CardHeader className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white pb-14 pt-10 px-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                                <User size={120} strokeWidth={1} />
                            </div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-none text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-tighter">Profile Metadata</Badge>
                                    </div>
                                    <CardTitle className="text-3xl font-black flex items-center gap-3 font-outfit uppercase">Biographic Data</CardTitle>
                                    <CardDescription className="text-emerald-100 text-base font-medium opacity-90">Update your clinical identity and avatar</CardDescription>
                                </div>
                                <div className="h-20 w-20 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl relative group/avatar bg-white/10 backdrop-blur-xl flex items-center justify-center">
                                    {photoURL ? (
                                        <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={32} className="text-emerald-200" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                                        <Camera size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="-mt-10 bg-white/80 backdrop-blur-md rounded-t-[48px] pt-12 px-10 pb-10 space-y-8 relative z-10 border-t border-emerald-100/50">
                            {message && (
                                <div className={`p-5 rounded-3xl text-[11px] font-black uppercase tracking-widest border animate-in zoom-in duration-300 flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' : 'bg-red-50/50 text-red-600 border-red-100'
                                    }`}>
                                    {message.type === 'success' ? <CheckCircle2 size={16} /> : <Activity size={16} />}
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="displayName" className="text-slate-500 font-black ml-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                            <User size={14} className="text-emerald-500" />
                                            Display Name
                                        </Label>
                                        <Input
                                            id="displayName"
                                            placeholder="System Operator"
                                            className="h-16 rounded-[20px] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[6px] focus:ring-emerald-500/10 transition-all font-outfit font-black text-xl border-2"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="email" className="text-slate-500 font-black ml-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                            <Mail size={14} className="text-emerald-500" />
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="h-16 rounded-[20px] border-slate-50 bg-slate-50/30 text-slate-400 font-outfit font-bold text-lg border-2 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="photoURL" className="text-slate-500 font-black ml-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                        <Camera size={14} className="text-emerald-500" />
                                        Avatar URL
                                    </Label>
                                    <Input
                                        id="photoURL"
                                        placeholder="https://images.unsplash.com/..."
                                        className="h-16 rounded-[20px] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[6px] focus:ring-emerald-500/10 transition-all font-medium text-sm border-2"
                                        value={photoURL}
                                        onChange={(e) => setPhotoURL(e.target.value)}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-18 rounded-[24px] text-base font-black bg-emerald-600 hover:bg-emerald-700 shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)] active:scale-[0.98] transition-all gap-3 py-8 group/btn relative overflow-hidden"
                                    disabled={loading}
                                >
                                    <span className="relative z-10 flex items-center gap-3 italic uppercase text-white">
                                        {loading ? 'Synchronizing...' : 'Commit Changes'}
                                        <Save size={20} className="text-emerald-200 group-hover:scale-110 transition-transform" />
                                    </span>
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Security Section */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-slate-900 text-white overflow-hidden group rounded-[40px]">
                        <CardHeader className="p-10 pb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-1 bg-emerald-500 w-8 rounded-full"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Security Protocols</p>
                            </div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                <ShieldCheck size={24} className="text-emerald-400" />
                                Access Control
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 space-y-8">
                            <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 group/item hover:bg-white/10 transition-all">
                                <div className="space-y-1">
                                    <p className="text-lg font-bold">Credential Reset</p>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm">Dispatch a secured password reset link to <span className="text-emerald-400">{user?.email}</span></p>
                                </div>
                                <Button
                                    onClick={handlePasswordReset}
                                    variant="outline"
                                    className="border-white/20 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest transition-all"
                                    disabled={loading}
                                >
                                    Execute Reset
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info Section */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                    <Card className="border-none shadow-[4px_0_24px_rgba(0,0,0,0.02)] bg-white/60 backdrop-blur-xl border border-white/60 p-10 rounded-[48px] space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">System Health</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Real-time status of your metabolic interface</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                                    <Activity size={22} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth Status</p>
                                    <p className="text-lg font-black text-slate-800">Verified Clinical</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                                    <Lock size={22} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encryption</p>
                                    <p className="text-lg font-black text-slate-800">AES-256 Quantum</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <div className="p-6 rounded-[32px] bg-slate-50/50 border border-slate-100 space-y-3">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Developer Note</p>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                                    "Your profile metadata is synchronized across all metabolic archives to ensure clinical continuity."
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="px-6 flex items-center justify-between text-slate-400">
                        <p className="text-[10px] font-black uppercase tracking-widest">Node ID: DC-{user?.uid.slice(0, 8).toUpperCase()}</p>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Bio-Link Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
