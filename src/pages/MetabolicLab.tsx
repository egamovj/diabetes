import React from 'react';
import { PieChart, Activity, Utensils, AlertCircle } from 'lucide-react';
import {
    PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar
} from 'recharts';
import { useHealthData } from '../hooks/useHealthData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateTIR, correlateMealData } from '../utils/metabolic';
import { cn } from "@/lib/utils";

const MetabolicLab: React.FC = () => {
    const { data: glucoseEntries } = useHealthData('glucose');
    const { data: mealEntries } = useHealthData('meal');
    const { data: symptomEntries } = useHealthData('symptom');

    const glucoseValues = glucoseEntries.map(g => g.value);
    const tir = calculateTIR(glucoseValues);
    const correlations = correlateMealData(mealEntries, glucoseEntries);

    const pieData = [
        { name: 'Low (< 4.0)', value: tir.low, color: '#ef4444' },
        { name: 'In Range (4.0-8.5)', value: tir.inRange, color: '#10b981' },
        { name: 'High (> 8.5)', value: tir.high, color: '#f59e0b' },
    ].filter(d => d.value > 0);

    const symptomLabels = symptomEntries.reduce((acc, s) => {
        (s.names || []).forEach((name: string) => {
            acc[name] = (acc[name] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const symptomDist = Object.entries(symptomLabels)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return (
        <div className="relative space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Background Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-96 h-96 bg-teal-100/20 dark:bg-teal-900/5 rounded-full blur-[100px] -z-10"></div>

            <header className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-3">
                    <div className="h-1 bg-emerald-500 w-12 rounded-full"></div>
                    <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold uppercase tracking-widest text-[10px] px-3">Advanced Clinical Insights</Badge>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white font-outfit uppercase leading-none drop-shadow-sm">
                    Metabolic <span className="text-emerald-600">Lab</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
                    Correlative deep-dives into your biological metadata for precise therapy adjustment.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                {/* Time In Range - The Gold Standard */}
                <Card className="lg:col-span-12 xl:col-span-5 border-none shadow-[0_32px_64px_-12px_rgba(16,185,129,0.1)] dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[40px] border border-white/50 dark:border-slate-800">
                    <CardHeader className="bg-gradient-to-br from-emerald-600 offset-0 via-emerald-700 to-teal-800 text-white p-10 pb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <PieChart size={140} strokeWidth={1} />
                        </div>
                        <div className="relative z-10 space-y-2">
                            <Badge className="bg-white/20 text-white border-none text-[9px] font-black uppercase tracking-widest px-2">Clinical Stability</Badge>
                            <CardTitle className="text-3xl font-black font-outfit uppercase">Time In Range</CardTitle>
                            <CardDescription className="text-emerald-50 opacity-80">Primary metric for metabolic control quality</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="-mt-10 bg-white dark:bg-slate-900 rounded-t-[48px] p-10 space-y-10 relative z-10 border-t border-white/10 dark:border-slate-800">
                        <div className="h-[300px] relative">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                        />
                                    </RePieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-700">
                                    <PieChart size={48} className="mb-4 opacity-20" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Logs</p>
                                </div>
                            )}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400 font-outfit">{tir.inRange}%</span>
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Target Met</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'LOW', val: tir.low, color: 'bg-red-500' },
                                { label: 'IN RANGE', val: tir.inRange, color: 'bg-emerald-500' },
                                { label: 'HIGH', val: tir.high, color: 'bg-amber-500' },
                            ].map(item => (
                                <div key={item.label} className="p-4 rounded-3xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2">
                                    <div className={cn("h-1.5 w-8 rounded-full", item.color)}></div>
                                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.label}</span>
                                    <span className="text-xl font-black text-slate-800 dark:text-white font-outfit">{item.val}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Meal Correlation - Trigger Identification */}
                <Card className="lg:col-span-12 xl:col-span-7 border-none shadow-[0_32px_64px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[40px] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800">
                    <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter dark:text-white">
                                <Utensils className="text-emerald-500" size={28} />
                                Trigger Analysis
                            </CardTitle>
                            <CardDescription className="text-slate-400 dark:text-slate-500">Post-prandial glycemic response correlation</CardDescription>
                        </div>
                        <AlertCircle className="text-slate-200 dark:text-slate-700" size={24} />
                    </CardHeader>
                    <CardContent className="h-[450px] px-10 pb-10">
                        {correlations.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={correlations}>
                                    <defs>
                                        <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="opacity-10" />
                                    <XAxis
                                        dataKey="timestamp"
                                        tickFormatter={(str) => new Date(str).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="postGlucose"
                                        stroke="#10b981"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorGlucose)"
                                        name="Post-Meal Glucose"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="carbs"
                                        stroke="#6366f1"
                                        strokeWidth={4}
                                        fillOpacity={0.1}
                                        fill="#6366f1"
                                        name="Carb Load (g)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-700 bg-slate-50/50 dark:bg-slate-800/30 rounded-[32px] border-4 border-dashed border-slate-100 dark:border-slate-800">
                                <Activity size={48} className="mb-4 opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Cross-referencing Meal/Glucose Datasets...</p>
                                <p className="text-[10px] mt-2 font-medium italic opacity-60">Requires meal logs followed by glucose checks within 2 hours.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Symptom Intensity Mapping */}
                <Card className="lg:col-span-12 border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none rounded-[40px] bg-slate-900 border border-slate-800 text-white overflow-hidden p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[9px] font-black uppercase tracking-widest px-3">Subjective distribution</Badge>
                                <h3 className="text-3xl font-black font-outfit uppercase">Symptom Frequency</h3>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                    Top biological triggers detected across your therapeutic journey.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {symptomDist.map(s => (
                                    <div key={s.name} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.name}</span>
                                            <span className="text-sm font-black text-emerald-400">{s.count} Logs</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                                                style={{ width: `${(s.count / Math.max(...symptomDist.map(d => d.count))) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                                {symptomDist.length === 0 && (
                                    <p className="text-slate-500 italic text-sm">Waiting for biometric feedback logs...</p>
                                )}
                            </div>
                        </div>

                        <div className="relative h-[400px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-[80px]"></div>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={symptomDist}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '16px' }}
                                    />
                                    <Bar dataKey="count" fill="#10b981" radius={[12, 12, 12, 12]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MetabolicLab;
