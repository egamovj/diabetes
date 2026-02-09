import React, { useState } from 'react';
import { Activity, Thermometer, Wind, Eye, Droplets, Smile, Zap, Frown, Plus, Info, Calendar, History, Sparkles } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { useHealthData } from '../hooks/useHealthData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Symptom {
    id: string;
    name: string;
    icon: React.ReactNode;
}

const predefinedSymptoms: Symptom[] = [
    { id: 'fatigue', name: 'Fatigue', icon: <Zap size={20} /> },
    { id: 'dizziness', name: 'Dizziness', icon: <Wind size={20} /> },
    { id: 'thirst', name: 'Excessive Thirst', icon: <Droplets size={20} /> },
    { id: 'vision', name: 'Blurred Vision', icon: <Eye size={20} /> },
    { id: 'sweating', name: 'Sweating', icon: <Thermometer size={20} /> },
    { id: 'irritability', name: 'Irritability', icon: <Frown size={20} /> },
    { id: 'sleep', name: 'Sleep Disturbance', icon: <Smile size={20} /> },
];

const SymptomLogger: React.FC = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [severity, setSeverity] = useState(2);
    const { data: entries, addEntry, loading } = useHealthData('symptom');
    const { data: glucoseEntries } = useHealthData('glucose');

    const toggleSymptom = (id: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (selectedSymptoms.length === 0) return;

        const symptomNames = selectedSymptoms.map(id => {
            if (id.startsWith('custom:')) return id.replace('custom:', '');
            return predefinedSymptoms.find(s => s.id === id)?.name || id;
        });

        await addEntry({
            symptoms: selectedSymptoms,
            severity,
            names: symptomNames
        });
        setSelectedSymptoms([]);
        setSeverity(2);
    };

    const correlationData = glucoseEntries.map(g => {
        const gDate = new Date(g.timestamp);
        const matchingSymptoms = entries.filter(s => {
            const sDate = new Date(s.timestamp);
            const diffHours = Math.abs(gDate.getTime() - sDate.getTime()) / (1000 * 60 * 60);
            return diffHours <= 2;
        });

        const count = matchingSymptoms.reduce((acc, s) => acc + (s.symptoms?.length || 0), 0);
        return {
            glucose: g.value,
            symptomCount: count,
            name: g.value > 8.5 ? 'High' : (g.value < 4.0 ? 'Low' : 'Normal')
        };
    }).filter(d => d.symptomCount > 0);

    return (
        <div className="relative space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Background Decorative Element */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-100/20 rounded-full blur-[100px] -z-10"></div>

            <header className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-3">
                    <div className="h-1 bg-emerald-500 w-12 rounded-full"></div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 font-bold uppercase tracking-widest text-[10px] px-3">Subjective Analysis</Badge>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 font-outfit uppercase leading-none drop-shadow-sm">
                    Symptoms <span className="text-emerald-600">&</span> Wellbeing
                </h1>
                <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">
                    Personalized symptom tracking to identify environmental and metabolic triggers.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
                {/* Log Section */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-10">
                    <Card className="border-none shadow-[0_32px_64px_-12px_rgba(16,185,129,0.1)] overflow-hidden bg-gradient-to-b from-white to-emerald-50/20 rounded-[40px] group border-t border-white">
                        <CardHeader className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white pb-14 pt-10 px-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                                <Activity size={120} strokeWidth={1} />
                            </div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-none text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-tighter">Status Report</Badge>
                                    </div>
                                    <CardTitle className="text-2xl font-black flex items-center gap-3 font-outfit uppercase">How are you feeling?</CardTitle>
                                    <CardDescription className="text-emerald-100 text-xs font-medium opacity-90">Select current observations</CardDescription>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl animate-bounce-slow">
                                    <Sparkles size={24} className="text-emerald-200" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="-mt-10 bg-white/80 backdrop-blur-md rounded-t-[48px] pt-12 px-10 pb-10 space-y-10 relative z-10 border-t border-emerald-100/50">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {predefinedSymptoms.map((s) => (
                                    <button
                                        key={s.id}
                                        className={cn(
                                            "group flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all duration-300 hover:scale-102",
                                            selectedSymptoms.includes(s.id)
                                                ? "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-100/50"
                                                : "border-slate-50 bg-slate-50/30 hover:border-emerald-200 hover:bg-white"
                                        )}
                                        onClick={() => toggleSymptom(s.id)}
                                    >
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-inner",
                                            selectedSymptoms.includes(s.id)
                                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-110"
                                                : "bg-white text-slate-300 group-hover:text-emerald-500"
                                        )}>
                                            {s.icon}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest transition-colors",
                                            selectedSymptoms.includes(s.id) ? "text-emerald-700" : "text-slate-400 group-hover:text-emerald-600"
                                        )}>{s.name}</span>
                                    </button>
                                ))}
                                <button
                                    className="group flex flex-col items-center gap-3 p-5 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/30 hover:border-emerald-400 hover:bg-white transition-all duration-300"
                                    onClick={() => {
                                        const custom = prompt('Enter symptom name:');
                                        if (custom) setSelectedSymptoms(prev => [...prev, `custom:${custom}`]);
                                    }}
                                >
                                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-white text-slate-300 group-hover:text-emerald-500 transition-all shadow-inner">
                                        <Plus size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Other</span>
                                </button>
                            </div>

                            <div className="space-y-6 pt-4">
                                <div className="flex items-center justify-between px-2">
                                    <Label className="text-slate-800 font-black uppercase text-xs tracking-[0.2em]">Overall Severity</Label>
                                    <Badge className={cn(
                                        "font-black px-4 py-1.5 text-[10px] uppercase rounded-full border-none shadow-sm",
                                        severity >= 4 ? "bg-red-50 text-red-600" : severity >= 3 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                    )}>
                                        Intensity Index: {severity}
                                    </Badge>
                                </div>
                                <div className="space-y-4 px-2">
                                    <input
                                        type="range"
                                        min="1" max="5"
                                        className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600 shadow-inner"
                                        value={severity}
                                        onChange={(e) => setSeverity(parseInt(e.target.value))}
                                    />
                                    <div className="flex justify-between px-1">
                                        {['Mild', 'Normal', 'Moderate', 'Strong', 'Severe'].map((label, i) => (
                                            <span key={label} className={cn(
                                                "text-[9px] font-black uppercase tracking-[0.1em]",
                                                severity === i + 1 ? "text-emerald-600 scale-110" : "text-slate-300"
                                            )}>
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full h-18 rounded-[24px] text-base font-black bg-emerald-600 hover:bg-emerald-700 shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)] active:scale-[0.98] transition-all gap-3 py-8 group/btn relative overflow-hidden"
                                onClick={handleSave}
                                disabled={loading || selectedSymptoms.length === 0}
                            >
                                <span className="relative z-10 flex items-center gap-3 italic uppercase">
                                    {loading ? 'Processing...' : 'Finalize Symptom Log'}
                                    <Activity size={20} className="animate-pulse" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-4">
                            <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 border border-emerald-50">
                                <History size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Feeling Cycle</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Temporal Archive</p>
                            </div>
                        </div>
                        <div className="space-y-6 pb-10">
                            {entries.length === 0 ? (
                                <div className="bg-white/60 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-slate-100 p-20 text-center space-y-6">
                                    <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                        <Smile size={48} className="text-slate-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">No Biometric Shifts</p>
                                        <p className="text-slate-400 text-sm font-medium italic">Your daily wellbeing history will consolidate here.</p>
                                    </div>
                                </div>
                            ) : (
                                entries.map((entry) => (
                                    <Card key={entry.id} className="border-none shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.15)] transition-all group overflow-hidden bg-white/80 backdrop-blur-md rounded-[32px] hover:-translate-y-1 active:scale-[0.99]">
                                        <div className={cn(
                                            "h-1.5 w-full",
                                            entry.severity === 5 ? "bg-red-500" : entry.severity >= 3 ? "bg-amber-500" : "bg-emerald-500"
                                        )}></div>
                                        <CardContent className="p-8">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 w-fit px-4 py-1.5 rounded-full border border-slate-100/50">
                                                        <Calendar size={12} className="text-emerald-500/50" />
                                                        {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(entry.names || []).map((name: string) => (
                                                            <Badge key={name} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-black text-[10px] uppercase py-1.5 px-4 rounded-xl shadow-sm">
                                                                {name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 bg-white/60 px-5 py-3 rounded-[24px] border border-white shadow-inner">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Intensity</p>
                                                    <div className="flex gap-1.5">
                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                            <div key={i} className={cn(
                                                                "h-2 w-5 rounded-full transition-all",
                                                                i <= entry.severity
                                                                    ? (entry.severity >= 4 ? "bg-red-500 shadow-sm shadow-red-200" : entry.severity >= 3 ? "bg-amber-500 shadow-sm shadow-amber-200" : "bg-emerald-500 shadow-sm shadow-emerald-200")
                                                                    : "bg-slate-200"
                                                            )}></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Analytics Section */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-10">
                    <Card className="border-none shadow-[0_32px_64px_rgba(0,0,0,0.04)] rounded-[48px] overflow-hidden bg-white/80 backdrop-blur-xl border border-white">
                        <CardHeader className="pt-10 px-8">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-black flex items-center gap-3 text-slate-900 uppercase tracking-tighter">
                                    <Activity className="text-emerald-600" size={28} />
                                    Correlation Board
                                </CardTitle>
                                <Info size={16} className="text-slate-300" />
                            </div>
                            <CardDescription className="text-slate-400 font-medium">Metric-Symptom Pattern Analysis</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-10">
                            <div className="h-[350px] mt-6">
                                {correlationData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                type="number"
                                                dataKey="glucose"
                                                name="Glucose"
                                                unit=" mmol/L"
                                                domain={[0, 15]}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                            />
                                            <YAxis
                                                type="number"
                                                dataKey="symptomCount"
                                                name="Symptoms"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                            />
                                            <ZAxis type="category" dataKey="name" name="Range" />
                                            <Tooltip
                                                cursor={{ strokeDasharray: '3 3' }}
                                                contentStyle={{
                                                    borderRadius: '24px',
                                                    border: 'none',
                                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                                                    background: 'rgba(255, 255, 255, 0.95)',
                                                    backdropFilter: 'blur(10px)',
                                                    padding: '20px'
                                                }}
                                            />
                                            <Scatter name="Readings" data={correlationData}>
                                                {correlationData.map((entry, index) => (
                                                    <circle
                                                        key={index}
                                                        cx={0} cy={0} r={entry.symptomCount * 3 + 6}
                                                        fill={entry.glucose > 8.5 || entry.glucose < 4.0 ? '#ef4444' : '#10b981'}
                                                        fillOpacity={0.5}
                                                        strokeWidth={3}
                                                        stroke={entry.glucose > 8.5 || entry.glucose < 4.0 ? '#dc2626' : '#059669'}
                                                    />
                                                ))}
                                            </Scatter>
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-300 border-4 border-dashed border-slate-50 rounded-[40px] bg-slate-50/20 p-8 text-center">
                                        <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-inner">
                                            <Info className="text-slate-200" size={32} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Cross-Analysis Data</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_32px_64px_rgba(5,150,105,0.2)] bg-gradient-to-br from-emerald-600 to-teal-800 text-white overflow-hidden relative group rounded-[48px]">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-all transform translate-x-8 -translate-y-8">
                            <Sparkles size={160} />
                        </div>
                        <CardHeader className="pt-10 px-8">
                            <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
                                <Sparkles size={24} className="text-emerald-200" />
                                Biological Insight
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-10">
                            <div className="flex gap-6 items-start relative z-10">
                                <div className="h-16 w-16 rounded-[24px] bg-white/20 backdrop-blur-xl flex items-center justify-center shrink-0 shadow-lg border border-white/20">
                                    <Activity size={32} />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-base leading-relaxed text-emerald-50 italic font-medium">
                                        "Biometric trends indicate a <span className="font-black text-white px-1 underline decoration-emerald-400">strong correlation</span> between glucose elevations and neurological fatigue."
                                    </p>
                                    <button className="text-[9px] font-black uppercase tracking-[0.3em] bg-white/10 hover:bg-white/25 px-5 py-2.5 rounded-full transition-all border border-white/10 hover:border-white/30 backdrop-blur-sm">
                                        Deep Analysis View
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SymptomLogger;
