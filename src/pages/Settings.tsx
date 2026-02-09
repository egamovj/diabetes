import React, { useState, useEffect } from 'react';
import { User, Mail, ShieldCheck, Save, Activity, CheckCircle2, Lock, BellRing, Clock, ShieldAlert, Droplets, Info, Sun, Moon, Monitor } from 'lucide-react';
import { auth } from '../config/firebase';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useReminders } from '../hooks/useReminders';
import { cn } from "@/lib/utils";
import { useTheme } from '../components/ThemeContext';

const Settings: React.FC = () => {
    const user = auth.currentUser;
    const { reminders, permission, requestPermission, toggleReminder, updateReminderTime } = useReminders();
    const { theme, setTheme } = useTheme();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [photoURL] = useState(user?.photoURL || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Medical ID state
    const [medicalID, setMedicalID] = useState({
        diabetesType: 'Type 1',
        bloodType: 'B+',
        emergencyContact: '',
        notes: ''
    });

    useEffect(() => {
        const savedID = localStorage.getItem('diabetes-medical-id');
        if (savedID) setMedicalID(JSON.parse(savedID));
    }, []);

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

    const handleSaveMedicalID = () => {
        setLoading(true);
        localStorage.setItem('diabetes-medical-id', JSON.stringify(medicalID));
        setTimeout(() => {
            setLoading(false);
            setMessage({ type: 'success', text: 'Emergency Medical ID updated and primed for SOS.' });
        }, 800);
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
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-100/20 dark:bg-teal-900/5 rounded-full blur-[100px] -z-10"></div>

            <header className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-3">
                    <div className="h-1 bg-emerald-500 w-12 rounded-full"></div>
                    <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold uppercase tracking-widest text-[10px] px-3">System Identity</Badge>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white font-outfit uppercase leading-none drop-shadow-sm">
                    Account <span className="text-emerald-600">Calibration</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
                    Personalize your metabolic profile and manage clinical security protocols.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
                {/* Main Content Area */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-10">
                    {/* Status Message */}
                    {message && (
                        <div className={`p-5 rounded-3xl text-[11px] font-black uppercase tracking-widest border animate-in zoom-in duration-300 flex items-center gap-3 ${message.type === 'success'
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                            : 'bg-red-50/50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={16} /> : <Activity size={16} />}
                            {message.text}
                        </div>
                    )}

                    <Card className="border-none shadow-[0_32px_64px_-12px_rgba(16,185,129,0.1)] dark:shadow-none overflow-hidden bg-gradient-to-b from-white to-emerald-50/20 dark:from-slate-900 dark:to-slate-900/50 rounded-[40px] group border-t border-white dark:border-slate-800">
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
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="-mt-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-t-[48px] pt-12 px-10 pb-10 space-y-8 relative z-10 border-t border-emerald-100/50 dark:border-slate-800">
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-slate-500 dark:text-slate-400 font-black ml-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                            <User size={14} className="text-emerald-500" />
                                            Display Name
                                        </Label>
                                        <Input
                                            placeholder="System Operator"
                                            className="h-16 rounded-[20px] border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-[6px] focus:ring-emerald-500/10 transition-all font-outfit font-black text-xl border-2"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-slate-500 dark:text-slate-400 font-black ml-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                            <Mail size={14} className="text-emerald-500" />
                                            Email Address
                                        </Label>
                                        <Input
                                            value={user?.email || ''}
                                            disabled
                                            className="h-16 rounded-[20px] border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 text-slate-400 font-outfit font-bold text-lg border-2 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-18 rounded-[24px] text-base font-black bg-emerald-600 hover:bg-emerald-700 shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)] transition-all gap-3 py-8"
                                    disabled={loading}
                                >
                                    <span className="flex items-center gap-3 italic uppercase text-white">
                                        {loading ? 'Synchronizing...' : 'Commit Changes'}
                                        <Save size={20} className="text-emerald-200" />
                                    </span>
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* SOS Medical ID Section */}
                    <Card className="border-none shadow-[0_32px_64px_-12px_rgba(220,38,38,0.1)] dark:shadow-none bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-red-50 dark:border-red-950/20">
                        <CardHeader className="p-10 pb-6 border-b border-slate-50 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-1 bg-red-500 w-8 rounded-full"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Emergency Protocol</p>
                            </div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                <ShieldAlert size={24} className="text-red-600" />
                                Emergency Medical ID
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-slate-500 dark:text-slate-400 font-black ml-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                        <Activity size={14} className="text-red-500" />
                                        Diabetes Type
                                    </Label>
                                    <Input
                                        value={medicalID.diabetesType}
                                        onChange={(e) => setMedicalID({ ...medicalID, diabetesType: e.target.value })}
                                        className="h-16 rounded-[20px] border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 transition-all font-outfit font-black text-xl border-2"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-slate-500 dark:text-slate-400 font-black ml-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                        <Droplets size={14} className="text-red-500" />
                                        Blood Group
                                    </Label>
                                    <Input
                                        value={medicalID.bloodType}
                                        onChange={(e) => setMedicalID({ ...medicalID, bloodType: e.target.value })}
                                        className="h-16 rounded-[20px] border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 transition-all font-outfit font-black text-xl border-2"
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <Label className="text-slate-500 dark:text-slate-400 font-black ml-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                        <Clock size={14} className="text-red-500" />
                                        Emergency Contact
                                    </Label>
                                    <Input
                                        placeholder="+1 (555) 000-0000"
                                        value={medicalID.emergencyContact}
                                        onChange={(e) => setMedicalID({ ...medicalID, emergencyContact: e.target.value })}
                                        className="h-16 rounded-[20px] border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 transition-all font-outfit font-black text-xl border-2"
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <Label className="text-slate-500 dark:text-slate-400 font-black ml-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                        <Info size={14} className="text-red-500" />
                                        Critical Notes
                                    </Label>
                                    <textarea
                                        value={medicalID.notes}
                                        onChange={(e) => setMedicalID({ ...medicalID, notes: e.target.value })}
                                        className="w-full p-6 rounded-[24px] border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 transition-all font-medium text-sm border-2 min-h-[120px] dark:text-white"
                                        placeholder="Any medications or instructions for first responders..."
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleSaveMedicalID}
                                className="w-full h-18 rounded-[24px] bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none text-white font-black uppercase tracking-widest gap-3"
                                disabled={loading}
                            >
                                <ShieldCheck size={20} />
                                Save SOS Medical ID
                            </Button>
                        </CardContent>
                    </Card>

                    {/* System Aesthetics Section */}
                    <Card className="border-none shadow-[0_32px_64px_-12px_rgba(16,185,129,0.05)] dark:shadow-none bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-emerald-50 dark:border-slate-800">
                        <CardHeader className="p-10 pb-6 border-b border-slate-50 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-1 bg-emerald-500 w-8 rounded-full"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Interface protocols</p>
                            </div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 dark:text-white font-outfit">
                                <Monitor size={24} className="text-emerald-500" />
                                System Aesthetics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { id: 'light', label: 'Light Pulse', icon: <Sun size={24} /> },
                                    { id: 'dark', label: 'Midnight', icon: <Moon size={24} /> },
                                    { id: 'system', label: 'Adaptive', icon: <Monitor size={24} /> }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setTheme(item.id as any)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-4 p-8 rounded-[32px] border-2 transition-all duration-500 group relative overflow-hidden",
                                            theme === item.id
                                                ? "bg-emerald-600 border-emerald-600 text-white shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)]"
                                                : "bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-white dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <div className={cn(
                                            "transition-transform duration-500 group-hover:scale-110",
                                            theme === item.id ? "text-emerald-100" : "text-emerald-500 opacity-40 group-hover:opacity-100"
                                        )}>
                                            {item.icon}
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-[10px]">{item.label}</span>
                                        {theme === item.id && (
                                            <div className="absolute top-2 right-2">
                                                <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reminders Section */}
                    <Card className="border-none shadow-[0_32px_64px_-12px_rgba(5,150,105,0.05)] dark:shadow-none bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-emerald-50 dark:border-slate-800">
                        <CardHeader className="p-10 pb-6 border-b border-slate-50 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-1 bg-emerald-500 w-8 rounded-full"></div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Clinical adherence</p>
                                    </div>
                                    <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 dark:text-white">
                                        <BellRing size={24} className="text-emerald-500" />
                                        Medical Alerts
                                    </CardTitle>
                                </div>
                                <Button
                                    onClick={requestPermission}
                                    variant="outline"
                                    className={cn(
                                        "rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest transition-all",
                                        permission === 'granted' ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800"
                                    )}
                                >
                                    {permission === 'granted' ? 'Notifications Active' : 'Enable Notifications'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-6">
                            {reminders.map((reminder) => (
                                <div key={reminder.id} className="flex items-center justify-between p-6 rounded-[32px] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 group transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl dark:shadow-none">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-inner",
                                            reminder.enabled ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-50"
                                        )}>
                                            {reminder.type === 'glucose' && <Activity size={24} />}
                                            {reminder.type === 'medication' && <ShieldCheck size={24} />}
                                            {reminder.type === 'bolus' && <ShieldAlert size={24} />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className={cn("text-lg font-black font-outfit dark:text-white", !reminder.enabled && "text-slate-400 dark:text-slate-600 opacity-50")}>{reminder.label}</p>
                                            <div className="flex items-center gap-2">
                                                <Clock size={12} className="text-slate-400 dark:text-slate-600" />
                                                <input
                                                    type="time"
                                                    value={reminder.time}
                                                    onChange={(e) => updateReminderTime(reminder.id, e.target.value)}
                                                    className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => toggleReminder(reminder.id)}
                                        variant="ghost"
                                        className={cn(
                                            "w-20 h-10 rounded-full font-black uppercase text-[10px] tracking-widest transition-all",
                                            reminder.enabled ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-300 dark:hover:bg-slate-700"
                                        )}
                                    >
                                        {reminder.enabled ? 'ON' : 'OFF'}
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Security Section */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white overflow-hidden group rounded-[40px]">
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
                                    Reset Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info Section */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                    <Card className="border-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-10 rounded-[48px] space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">System Health</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Real-time status of your metabolic interface</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                                    <Activity size={22} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth Status</p>
                                    <p className="text-lg font-black text-slate-800 dark:text-slate-200">Verified Clinical</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                                    <Lock size={22} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encryption</p>
                                    <p className="text-lg font-black text-slate-800 dark:text-slate-200">AES-256 Protocol</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="p-6 rounded-[32px] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-3">
                                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Adherence Alert</p>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                    {reminders.some(r => r.enabled)
                                        ? "Your active medical protocols are being monitored by the system's neural clock."
                                        : "Protocol alerts currently inactive. Enabling reminders improves metabolic long-term success."}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="px-6 flex items-center justify-between text-slate-400 dark:text-slate-600">
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
