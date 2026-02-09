import React, { useState } from 'react';
import { Activity, History, Scale, Moon, Droplets, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { useHealthData } from '../hooks/useHealthData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '../contexts/LanguageContext';

const Wellness: React.FC = () => {
    const { t } = useLanguage();
    const [weight, setWeight] = useState('');
    const [sleep, setSleep] = useState('');
    const [water, setWater] = useState('');
    const { data: entries, addEntry, loading } = useHealthData('wellness' as any);

    const handleSave = async () => {
        if (!weight && !sleep && !water) return;
        await addEntry({
            weight: parseFloat(weight) || 0,
            sleep: parseFloat(sleep) || 0,
            water: parseFloat(water) || 0,
            timestamp: new Date().toISOString()
        });
        setWeight('');
        setSleep('');
        setWater('');
    };

    return (
        <div className="relative space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Background Decorative Element */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-100/20 rounded-full blur-[100px] -z-10"></div>

            <header className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-3">
                    <div className="h-1 bg-emerald-500 w-12 rounded-full"></div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 font-bold uppercase tracking-widest text-[10px] px-3">{t('vital_systems')}</Badge>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 font-outfit uppercase leading-none drop-shadow-sm">
                    {t('wellness')} <span className="text-emerald-600">&</span> {t('vitals')}
                </h1>
                <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">
                    {t('holistic_overview')}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
                {/* Input Section */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-10">
                    <Card className="border-none shadow-[0_32px_64px_-12px_rgba(16,185,129,0.1)] overflow-hidden bg-gradient-to-b from-white to-emerald-50/20 rounded-[40px] group border-t border-white">
                        <CardHeader className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white pb-14 pt-10 px-10 relative overflow-hidden">
                            {/* Decorative Sparkle inside header */}
                            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                                <Activity size={120} strokeWidth={1} />
                            </div>

                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-none text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-tighter">{t('daily_ledger')}</Badge>
                                    </div>
                                    <CardTitle className="text-3xl font-black flex items-center gap-3 font-outfit">
                                        <TrendingUp size={32} />
                                        {t('health_checkin')}
                                    </CardTitle>
                                    <CardDescription className="text-emerald-100 text-base font-medium opacity-90">
                                        {t('update_vitals_tip')}
                                    </CardDescription>
                                </div>
                                <div className="h-16 w-16 rounded-[24px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl animate-bounce-slow">
                                    <Sparkles size={32} className="text-emerald-200" />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="-mt-10 bg-white/80 backdrop-blur-md rounded-t-[48px] pt-12 px-10 pb-10 space-y-10 transition-all relative z-10 border-t border-emerald-100/50 shadow-[0_-12px_40px_-12px_rgba(16,185,129,0.05)]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="weight" className="text-slate-500 font-black ml-1 uppercase text-[10px] tracking-[0.2em]">{t('body_weight')}</Label>
                                    <div className="relative group/input">
                                        <Input
                                            id="weight"
                                            type="number"
                                            placeholder="0.0"
                                            className="h-16 pl-14 rounded-[20px] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[6px] focus:ring-emerald-500/10 transition-all font-outfit font-bold text-lg border-2"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-focus-within/input:bg-emerald-600 group-focus-within/input:text-white transition-all">
                                            <Scale size={18} />
                                        </div>
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xs uppercase tracking-tighter">{t('kg')}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="sleep" className="text-slate-500 font-black ml-1 uppercase text-[10px] tracking-[0.2em]">{t('rest_duration')}</Label>
                                    <div className="relative group/input">
                                        <Input
                                            id="sleep"
                                            type="number"
                                            placeholder="0"
                                            className="h-16 pl-14 rounded-[20px] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[6px] focus:ring-indigo-500/10 transition-all font-outfit font-bold text-lg border-2"
                                            value={sleep}
                                            onChange={(e) => setSleep(e.target.value)}
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-focus-within/input:bg-indigo-600 group-focus-within/input:text-white transition-all">
                                            <Moon size={18} />
                                        </div>
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xs uppercase tracking-tighter">{t('hrs')}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="water" className="text-slate-500 font-black ml-1 uppercase text-[10px] tracking-[0.2em]">{t('hydration_level')}</Label>
                                    <div className="relative group/input">
                                        <Input
                                            id="water"
                                            type="number"
                                            step="0.1"
                                            placeholder="0.0"
                                            className="h-16 pl-14 rounded-[20px] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[6px] focus:ring-blue-500/10 transition-all font-outfit font-bold text-lg border-2"
                                            value={water}
                                            onChange={(e) => setWater(e.target.value)}
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-focus-within/input:bg-blue-600 group-focus-within/input:text-white transition-all">
                                            <Droplets size={18} />
                                        </div>
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xs uppercase tracking-tighter">{t('liters')}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full h-18 rounded-[24px] text-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)] active:scale-[0.98] transition-all gap-3 py-8 group/btn overflow-hidden relative"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                <span className="relative z-10 flex items-center gap-3 italic">
                                    {loading ? t('sync_profile') : t('finalize_daily_entry')}
                                    <Activity size={24} className="animate-pulse" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[36px] flex items-center gap-6 group hover:bg-white/60 transition-all hover:-translate-y-1">
                            <div className="h-16 w-16 rounded-2xl bg-indigo-100/50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                                <Moon size={28} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('medical_focus')}</p>
                                <p className="text-base font-bold text-slate-800 leading-tight">{t('sleep_glucose_insight')}</p>
                            </div>
                        </Card>
                        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[36px] flex items-center gap-6 group hover:bg-white/60 transition-all hover:-translate-y-1">
                            <div className="h-16 w-16 rounded-2xl bg-blue-100/50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                <Droplets size={28} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('scientific_tip')}</p>
                                <p className="text-base font-bold text-slate-800 leading-tight">{t('hydration_cortisol_insight')}</p>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* History Section - The "Zone" */}
                <div className="lg:col-span-12 xl:col-span-5 relative">
                    <div className="sticky top-10 space-y-8 p-8 bg-emerald-50/30 rounded-[48px] border-2 border-dashed border-emerald-100/50">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 border border-emerald-50">
                                    <History size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{t('vitals_archive')}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('historical_perf')}</p>
                                </div>
                            </div>
                            {entries.length > 0 && (
                                <Badge className="bg-emerald-600 text-white border-none text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-emerald-200">
                                    {entries.length} {t('logs_count')}
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-5 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                            {entries.length === 0 ? (
                                <div className="bg-white/60 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-slate-200 p-16 text-center space-y-6">
                                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform">
                                        <Activity size={40} className="text-slate-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-slate-500 font-black uppercase text-xs tracking-[0.3em]">{t('no_data_synced')}</p>
                                        <p className="text-slate-400 text-sm font-medium italic">{t('begin_journey_tip')}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {entries.map((entry) => (
                                        <Card key={entry.id} className="border-none shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.15)] transition-all group overflow-hidden bg-white/80 backdrop-blur-md rounded-[32px] hover:-translate-y-1 active:scale-[0.99]">
                                            <CardContent className="p-0">
                                                <div className="flex items-stretch min-h-[120px]">
                                                    <div className="w-3 bg-emerald-500 group-hover:w-4 transition-all"></div>
                                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                                                                <Calendar size={12} className="text-emerald-500" />
                                                                {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                            </div>
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                        </div>

                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex flex-col bg-emerald-50/50 p-2 px-4 rounded-2xl flex-1 border border-emerald-100/30">
                                                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 opacity-70">{t('weight')}</span>
                                                                <span className="text-2xl font-black text-slate-800 font-outfit leading-none">{entry.weight}<small className="text-[10px] ml-1 text-slate-400 font-bold uppercase">{t('kg')}</small></span>
                                                            </div>
                                                            <div className="flex flex-col bg-indigo-50/50 p-2 px-4 rounded-2xl flex-1 border border-indigo-100/30">
                                                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1 opacity-70">{t('sleep')}</span>
                                                                <span className="text-2xl font-black text-slate-800 font-outfit leading-none">{entry.sleep}<small className="text-[10px] ml-1 text-slate-400 font-bold uppercase">{t('hrs')}</small></span>
                                                            </div>
                                                            <div className="flex flex-col bg-blue-50/50 p-2 px-4 rounded-2xl flex-1 border border-blue-100/30">
                                                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1 opacity-70">{t('water')}</span>
                                                                <span className="text-2xl font-black text-slate-800 font-outfit leading-none">{entry.water}<small className="text-[10px] ml-1 text-slate-400 font-bold uppercase">{t('liters_short')}</small></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wellness;
