import React, { useState } from 'react';
import { Droplets, Info, AlertCircle, CheckCircle2, History, TrendingUp, Calendar, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useHealthData } from '../hooks/useHealthData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const GlucoseTracker: React.FC = () => {
    const [level, setLevel] = useState<string>('');
    const [type, setType] = useState<string>('Fasting');
    const { data: entries, addEntry, loading } = useHealthData('glucose');

    const handleAddEntry = async () => {
        if (!level) return;
        await addEntry({
            value: parseFloat(level),
            type,
            notes: ''
        });
        setLevel('');
    };

    const getStatus = (val: number) => {
        if (val < 4.0) return { label: 'Low', color: 'text-red-600', bgColor: 'bg-red-50', icon: <AlertCircle size={16} /> };
        if (val > 8.5) return { label: 'High', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: <Info size={16} /> };
        return { label: 'Normal', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: <CheckCircle2 size={16} /> };
    };

    return (
        <div className="relative space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Background Decorative Element */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-100/20 rounded-full blur-[100px] -z-10"></div>

            <header className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-3">
                    <div className="h-1 bg-emerald-500 w-12 rounded-full"></div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 font-bold uppercase tracking-widest text-[10px] px-3">Metabolic Tracking</Badge>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 font-outfit uppercase leading-none drop-shadow-sm">
                    Blood <span className="text-emerald-600">Glucose</span>
                </h1>
                <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">
                    Analyzing glucose fluctuations for precise metabolic regulation.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
                {/* Input Section */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-10">
                    <Card className="border-none shadow-[0_32px_64px_-12px_rgba(16,185,129,0.1)] overflow-hidden bg-gradient-to-b from-white to-emerald-50/20 rounded-[40px] group border-t border-white">
                        <CardHeader className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white pb-14 pt-10 px-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                                <Droplets size={120} strokeWidth={1} />
                            </div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-none text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-tighter">New Entry</Badge>
                                    </div>
                                    <CardTitle className="text-2xl font-black flex items-center gap-3 font-outfit uppercase">Log Levels</CardTitle>
                                    <CardDescription className="text-emerald-100 text-xs font-medium opacity-90">Current biological marker</CardDescription>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl animate-bounce-slow">
                                    <Droplets size={24} className="text-emerald-200" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="-mt-10 bg-white/80 backdrop-blur-md rounded-t-[48px] pt-12 px-8 pb-8 space-y-8 relative z-10 border-t border-emerald-100/50">
                            <div className="space-y-3">
                                <Label htmlFor="level" className="text-slate-500 font-black ml-1 uppercase text-[10px] tracking-[0.2em]">Glucose Level (mmol/L)</Label>
                                <div className="relative group/input">
                                    <Input
                                        id="level"
                                        type="number"
                                        step="0.1"
                                        placeholder="0.0"
                                        className="h-16 pl-14 rounded-[20px] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[6px] focus:ring-emerald-500/10 transition-all font-outfit font-black text-xl border-2"
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-focus-within/input:bg-emerald-600 group-focus-within/input:text-white transition-all">
                                        <Droplets size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-slate-500 font-black ml-1 uppercase text-[10px] tracking-[0.2em]">Synchronization Period</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Fasting', 'Before Meal', 'After Meal', 'Bedtime'].map((t) => (
                                        <Button
                                            key={t}
                                            variant={type === t ? "default" : "outline"}
                                            className={cn(
                                                "h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                type === t
                                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                                    : "text-slate-400 border-slate-100 hover:bg-emerald-50 hover:text-emerald-600"
                                            )}
                                            onClick={() => setType(t)}
                                        >
                                            {t}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                className="w-full h-16 rounded-[24px] text-base font-black bg-emerald-600 hover:bg-emerald-700 shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)] active:scale-[0.98] transition-all gap-2 py-8 group/btn relative overflow-hidden"
                                onClick={handleAddEntry}
                                disabled={!level || loading}
                            >
                                <span className="relative z-10 flex items-center gap-3 italic uppercase">
                                    {loading ? 'Processing...' : 'Sync Vital Marker'}
                                    <Activity size={20} className="animate-pulse" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[40px] space-y-6">
                        <header className="flex items-center gap-3 px-2">
                            <div className="h-2 w-10 bg-emerald-500 rounded-full"></div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Reference Standards</h3>
                        </header>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-3xl bg-white/60 border border-white shadow-sm transition-all hover:translate-x-1">
                                <div className="flex items-center gap-4">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200 animate-pulse"></div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Normal Range</span>
                                </div>
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">4.0 - 7.0</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-3xl bg-white/60 border border-white shadow-sm transition-all hover:translate-x-1">
                                <div className="flex items-center gap-4">
                                    <div className="h-3 w-3 rounded-full bg-amber-500 shadow-lg shadow-amber-200"></div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Elevated State</span>
                                </div>
                                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full">&gt; 8.5</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-3xl bg-white/60 border border-white shadow-sm transition-all hover:translate-x-1">
                                <div className="flex items-center gap-4">
                                    <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-200"></div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Hypoglycemic</span>
                                </div>
                                <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full">&lt; 3.5</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Chart & History Area */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-10 relative">
                    <Card className="border-none shadow-[0_32px_64px_rgba(0,0,0,0.04)] rounded-[48px] overflow-hidden bg-white/80 backdrop-blur-xl border border-white">
                        <CardHeader className="flex flex-row items-center justify-between pt-10 px-10 pb-4">
                            <div className="space-y-1">
                                <CardTitle className="text-3xl font-black flex items-center gap-3 uppercase tracking-tighter">
                                    <TrendingUp className="text-emerald-600" size={32} />
                                    Metric Trends
                                </CardTitle>
                                <CardDescription className="text-slate-400 font-medium">Temporal analysis of glycemic variations</CardDescription>
                            </div>
                            <select className="h-10 px-4 text-[10px] font-black uppercase tracking-widest border-slate-100 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-50 bg-white transition-all cursor-pointer">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </CardHeader>
                        <CardContent className="h-[450px] mt-6 px-10 pb-10">
                            {entries.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={[...entries].reverse()}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="timestamp"
                                            tickFormatter={(str) => new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                            dy={20}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                            domain={[0, 15]}
                                            dx={-20}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '24px',
                                                border: 'none',
                                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                                                padding: '20px',
                                                background: 'rgba(255, 255, 255, 0.95)',
                                                backdropFilter: 'blur(10px)'
                                            }}
                                        />
                                        <ReferenceLine y={4} stroke="#10b981" strokeDasharray="8 8" strokeWidth={2} opacity={0.3} />
                                        <ReferenceLine y={8.5} stroke="#f59e0b" strokeDasharray="8 8" strokeWidth={2} opacity={0.3} />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#059669"
                                            strokeWidth={6}
                                            dot={{ r: 8, fill: '#059669', strokeWidth: 4, stroke: '#fff' }}
                                            activeDot={{ r: 10, strokeWidth: 0 }}
                                            animationDuration={2000}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-300 border-4 border-dashed border-slate-50 rounded-[40px] bg-slate-50/30">
                                    <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-inner mb-6">
                                        <History size={48} className="text-slate-200" />
                                    </div>
                                    <p className="font-black uppercase tracking-widest text-xs">Awaiting data logs</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6 pt-2">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 border border-emerald-50">
                                    <History size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Metabolic Archive</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Measurements</p>
                                </div>
                            </div>
                            <Badge className="bg-emerald-600 text-white border-none text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg shadow-emerald-200">
                                {entries.length} Synced Readings
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                            {entries.map((entry) => {
                                const status = getStatus(entry.value);
                                return (
                                    <Card key={entry.id} className="border-none shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.15)] transition-all group overflow-hidden bg-white/80 backdrop-blur-md rounded-[32px] hover:-translate-y-1 active:scale-[0.99]">
                                        <CardContent className="p-0">
                                            <div className="flex items-stretch min-h-[110px]">
                                                <div className={cn("w-3 transition-all group-hover:w-4",
                                                    entry.value >= 8.5 ? "bg-amber-500" :
                                                        entry.value <= 4.0 ? "bg-red-500" : "bg-emerald-500"
                                                )}></div>
                                                <div className="flex-1 p-6 flex items-center justify-between">
                                                    <div className="flex items-center gap-5">
                                                        <div className={cn(
                                                            "h-16 w-16 rounded-[22px] flex items-center justify-center text-2xl font-black font-outfit shadow-inner",
                                                            status.bgColor,
                                                            status.color
                                                        )}>
                                                            {entry.value}
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-3">
                                                                <p className="font-black text-slate-800 text-base uppercase tracking-tighter leading-none">{entry.type}</p>
                                                                <Badge className={cn(
                                                                    "text-[8px] font-black uppercase px-2 h-4 border-none tracking-tighter",
                                                                    status.bgColor,
                                                                    status.color
                                                                )}>
                                                                    {status.label}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <Calendar size={12} className="text-emerald-500/50" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                                                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={cn("opacity-20 group-hover:opacity-100 transition-all transform group-hover:scale-110", status.color)}>
                                                        {status.icon}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                        {entries.length === 0 && (
                            <div className="bg-white/60 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-slate-100 p-20 text-center space-y-6">
                                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <Activity size={48} className="text-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">Historical Void</p>
                                    <p className="text-slate-400 text-sm font-medium italic">Your metabolic journey begins with your first log.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlucoseTracker;
