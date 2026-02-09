import React from 'react';
import { Flame, Utensils, Droplets, TrendingUp, Activity, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHealthData } from '../hooks/useHealthData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Dashboard: React.FC = () => {
    const { data: glucoseEntries } = useHealthData('glucose');
    const { data: symptomEntries } = useHealthData('symptom');
    const { data: mealEntries } = useHealthData('meal');

    const latestGlucose = glucoseEntries[0]?.value || 0;
    const avgGlucose = glucoseEntries.length > 0
        ? (glucoseEntries.reduce((acc, g) => acc + g.value, 0) / glucoseEntries.length).toFixed(1)
        : '0.0';

    const todayCarbs = mealEntries.reduce((acc, m) => acc + (m.carbs || 0), 0);
    const totalInsulin = mealEntries.reduce((acc, m) => acc + (m.insulin || 0), 0);

    const chartData = [...glucoseEntries].reverse().map(g => ({
        time: g.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        level: g.value
    })).slice(-10);

    const activityFeed = [...glucoseEntries, ...symptomEntries]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 8);

    return (
        <div className="relative space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Background Decorative Element */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-100/20 rounded-full blur-[100px] -z-10"></div>

            <header className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-3">
                    <div className="h-1 bg-emerald-500 w-12 rounded-full"></div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 font-bold uppercase tracking-widest text-[10px] px-3">System Synopsis</Badge>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 font-outfit uppercase leading-none drop-shadow-sm">
                    Health <span className="text-emerald-600">Overview</span>
                </h1>
                <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">
                    Personalized health analytics and real-time biometric synchronization.
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <Card className="border-none shadow-[0_32px_64px_-12px_rgba(16,185,129,0.1)] bg-gradient-to-br from-white to-emerald-50/30 rounded-[40px] overflow-hidden group hover:scale-[1.02] transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Latest Glucose</CardTitle>
                        <div className="h-12 w-12 rounded-[20px] bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                            <Droplets size={24} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black text-slate-900 font-outfit">
                            {latestGlucose} <span className="text-lg font-bold text-slate-400">mmol/L</span>
                        </div>
                        <div className="mt-6 flex items-center gap-2">
                            <Badge className="bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 border-none font-black py-1.5 px-4 rounded-full text-[10px] uppercase group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <TrendingUp size={14} className="mr-1.5" /> Average: {avgGlucose}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_32px_64px_-12px_rgba(20,184,166,0.1)] bg-gradient-to-br from-white to-teal-50/30 rounded-[40px] overflow-hidden group hover:scale-[1.02] transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">Insulin Load</CardTitle>
                        <div className="h-12 w-12 rounded-[20px] bg-teal-100 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shadow-inner">
                            <Flame size={24} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black text-slate-900 font-outfit">
                            {totalInsulin.toFixed(1)} <span className="text-lg font-bold text-slate-400">Units</span>
                        </div>
                        <p className="text-[10px] text-teal-500 mt-6 font-black uppercase tracking-widest opacity-60">Calculated from journals</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_32px_64px_-12px_rgba(5,150,105,0.1)] bg-gradient-to-br from-white to-emerald-50/20 rounded-[40px] overflow-hidden group hover:scale-[1.02] transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Carb Intake</CardTitle>
                        <div className="h-12 w-12 rounded-[20px] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                            <Utensils size={24} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black text-slate-900 font-outfit">
                            {todayCarbs} <span className="text-lg font-bold text-slate-400">g</span>
                        </div>
                        <p className="text-[10px] text-emerald-500 mt-6 font-black uppercase tracking-widest opacity-60">Daily cumulative</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Chart Area */}
                <Card className="lg:col-span-8 border-none shadow-[0_32px_64px_rgba(0,0,0,0.04)] rounded-[48px] overflow-hidden bg-white/80 backdrop-blur-xl border border-white">
                    <CardHeader className="pb-8 pt-10 px-10">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter">
                                    <TrendingUp className="text-emerald-600" size={32} />
                                    Glucose Trends
                                </CardTitle>
                                <CardDescription className="text-slate-400 font-medium">Visualizing biological patterns over time</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[450px] px-10 pb-10">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="time"
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
                                    <Area
                                        type="monotone"
                                        dataKey="level"
                                        stroke="#059669"
                                        fillOpacity={1}
                                        fill="url(#colorLevel)"
                                        strokeWidth={4}
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-300 border-4 border-dashed border-slate-50 rounded-[40px] bg-slate-50/30">
                                <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-inner mb-6 transition-transform hover:scale-110">
                                    <Activity size={48} className="text-slate-200" />
                                </div>
                                <p className="font-black uppercase tracking-widest text-xs">No analytics available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Activity Feed */}
                <Card className="lg:col-span-4 border-none shadow-[0_32px_64px_rgba(0,0,0,0.04)] rounded-[48px] bg-emerald-50/30 border-2 border-dashed border-emerald-100/50">
                    <CardHeader className="pt-10 px-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 border border-emerald-50">
                                <Clock size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black uppercase tracking-tighter">Activity</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Latest Updates</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-10">
                        <div className="space-y-5">
                            {activityFeed.length > 0 ? (
                                activityFeed.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-5 p-5 rounded-[32px] bg-white/80 backdrop-blur-md shadow-sm transition-all hover:shadow-md hover:scale-[1.02] group border border-white">
                                        <div className={cn(
                                            "h-12 w-12 rounded-[18px] flex items-center justify-center transition-all group-hover:scale-110 shadow-inner",
                                            item.value !== undefined ? "bg-emerald-100 text-emerald-600" : "bg-teal-100 text-teal-600"
                                        )}>
                                            {item.value !== undefined ? <Droplets size={20} /> : <Activity size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-800 leading-none text-base">
                                                {item.value !== undefined
                                                    ? `${item.value}`
                                                    : (item.names || []).join(', ')
                                                }
                                                <small className="text-[10px] ml-1 text-slate-400 font-bold uppercase">{item.value !== undefined ? 'mmol/L' : ''}</small>
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 opacity-60">
                                                {item.value !== undefined ? 'Glucose' : 'Symptoms'}
                                            </p>
                                        </div>
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter bg-emerald-50 px-3 py-1 rounded-full">
                                            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-slate-100 px-6">
                                    <div className="bg-slate-50 rounded-full h-20 w-20 mx-auto flex items-center justify-center mb-6 shadow-inner">
                                        <Clock size={32} className="text-slate-200" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Silent System</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
