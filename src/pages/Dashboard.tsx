import React from 'react';
import { Utensils, Droplets, TrendingUp, Activity, Clock, Download, Info, ShieldCheck, BellRing } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHealthData } from '../hooks/useHealthData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calculateHbA1c, calculateTrend, getHbA1cStatus } from '../utils/metabolic';
import { exportToCSV } from '../utils/export';
import { useReminders } from '../hooks/useReminders';

const Dashboard: React.FC = () => {
    const { data: glucoseEntries } = useHealthData('glucose');
    const { data: symptomEntries } = useHealthData('symptom');
    const { data: mealEntries } = useHealthData('meal');
    const { reminders } = useReminders();

    const latestGlucose = glucoseEntries[0]?.value || 0;
    const avgGlucose = glucoseEntries.length > 0
        ? parseFloat((glucoseEntries.reduce((acc, g) => acc + g.value, 0) / glucoseEntries.length).toFixed(1))
        : 0;

    const projectedHbA1c = calculateHbA1c(avgGlucose);
    const hbStatus = getHbA1cStatus(projectedHbA1c);

    // Get next upcoming enabled reminder
    const enabledReminders = reminders.filter(r => r.enabled);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const nextReminder = enabledReminders
        .sort((a, b) => a.time.localeCompare(b.time))
        .find(r => r.time > nowStr) || enabledReminders[0];

    // Trend analysis (Last 14 days vs previous 14 days)
    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const twentyEightDaysAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    const currentPeriodGlucose = glucoseEntries
        .filter(g => g.timestamp >= fourteenDaysAgo)
        .map(g => g.value);
    const previousPeriodGlucose = glucoseEntries
        .filter(g => g.timestamp >= twentyEightDaysAgo && g.timestamp < fourteenDaysAgo)
        .map(g => g.value);

    const glucoseTrend = calculateTrend(currentPeriodGlucose, previousPeriodGlucose);

    const todayCarbs = mealEntries.reduce((acc, m) => acc + (m.carbs || 0), 0);

    const chartData = [...glucoseEntries].reverse().map(g => ({
        time: g.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        level: g.value
    })).slice(-10);

    const activityFeed = [...glucoseEntries, ...symptomEntries]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 8);

    const handleExport = () => {
        const allData = [...glucoseEntries, ...symptomEntries, ...mealEntries]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        exportToCSV(allData, `diabetes_report_${new Date().toISOString().split('T')[0]}`);
    };

    return (
        <div className="relative space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Background Decorative Element */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-100/20 dark:bg-teal-900/5 rounded-full blur-[100px] -z-10"></div>

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-1 bg-emerald-500 w-12 rounded-full"></div>
                        <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold uppercase tracking-widest text-[10px] px-3">System Synopsis</Badge>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white font-outfit uppercase leading-none drop-shadow-sm">
                        Health <span className="text-emerald-600">Overview</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
                        Personalized health analytics and real-time biometric synchronization.
                    </p>
                </div>

                <Button
                    onClick={handleExport}
                    className="h-16 px-8 rounded-[24px] bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 shadow-xl shadow-emerald-200/20 dark:shadow-none font-black uppercase text-[10px] tracking-widest gap-3 transition-all group"
                >
                    <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
                    Dispatch Report
                </Button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                <Card className="border-none shadow-[0_32px_64px_-12px_rgba(16,185,129,0.1)] dark:shadow-none bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-slate-900/50 rounded-[40px] overflow-hidden group hover:scale-[1.02] transition-all border border-white/50 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Latest Glucose</CardTitle>
                        <div className="h-12 w-12 rounded-[20px] bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                            <Droplets size={24} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black text-slate-900 dark:text-white font-outfit">
                            {latestGlucose} <span className="text-lg font-bold text-slate-400 dark:text-slate-500">mmol/L</span>
                        </div>
                        <div className="mt-6 flex items-center gap-2">
                            <Badge className={cn(
                                "border-none font-black py-1.5 px-4 rounded-full text-[10px] uppercase transition-all flex items-center gap-1.5",
                                glucoseTrend === 'rising' ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400" :
                                    glucoseTrend === 'falling' ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" :
                                        "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500"
                            )}>
                                {glucoseTrend === 'rising' && <TrendingUp size={14} className="rotate-0" />}
                                {glucoseTrend === 'falling' && <TrendingUp size={14} className="rotate-180" />}
                                {glucoseTrend === 'stable' && <Activity size={14} />}
                                Trend: {glucoseTrend}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_32px_64px_-12px_rgba(16,185,129,0.1)] dark:shadow-none bg-gradient-to-br from-indigo-900 to-slate-900 dark:from-indigo-950 dark:to-slate-950 rounded-[40px] overflow-hidden group hover:scale-[1.02] transition-all text-white relative border border-white/5 dark:border-slate-800">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                        <ShieldCheck size={120} strokeWidth={1} />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                        <CardTitle className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Metabolic Projection</CardTitle>
                        <div className="h-12 w-12 rounded-[20px] bg-white/10 dark:bg-emerald-950/30 backdrop-blur-md text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xl">
                            <Info size={24} />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-5xl font-black font-outfit">
                            {projectedHbA1c}% <span className="text-lg font-bold text-white/40 italic">HbA1c</span>
                        </div>
                        <div className="mt-6">
                            <Badge className={cn(
                                "border-none font-black py-1.5 px-4 rounded-full text-[9px] uppercase tracking-tighter",
                                hbStatus.bgColor, hbStatus.color
                            )}>
                                Status: {hbStatus.label}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_32px_64px_-12px_rgba(20,184,166,0.1)] dark:shadow-none bg-gradient-to-br from-teal-600 to-emerald-900 dark:from-teal-950 dark:to-emerald-950 rounded-[40px] overflow-hidden group hover:scale-[1.02] transition-all text-white border border-white/5 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black text-teal-200 dark:text-teal-400 uppercase tracking-[0.2em]">{nextReminder ? 'Scheduled Protocol' : 'No Scheduled Alerts'}</CardTitle>
                        <div className="h-12 w-12 rounded-[20px] bg-white/10 dark:bg-emerald-950/30 text-white flex items-center justify-center group-hover:bg-white group-hover:text-teal-900 dark:group-hover:text-teal-400 transition-all shadow-xl backdrop-blur-md">
                            <BellRing size={24} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {nextReminder ? (
                            <>
                                <div className="text-4xl font-black font-outfit truncate">
                                    {nextReminder.time} <span className="text-sm font-bold text-teal-300/60 font-outfit uppercase tracking-widest ml-1">Next Check</span>
                                </div>
                                <div className="mt-4">
                                    <Badge className="bg-white/10 dark:bg-emerald-950/50 text-white border-none font-black py-1 px-3 rounded-full text-[9px] uppercase tracking-tighter truncate max-w-full block">
                                        {nextReminder.label}
                                    </Badge>
                                </div>
                            </>
                        ) : (
                            <div className="text-xl font-black font-outfit opacity-40 py-4">
                                Monitoring Disengaged
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_32px_64px_-12px_rgba(5,150,105,0.1)] dark:shadow-none bg-gradient-to-br from-white to-emerald-50/20 dark:from-slate-900 dark:to-slate-900/50 rounded-[40px] overflow-hidden group hover:scale-[1.02] transition-all border border-white/50 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Carb Intake</CardTitle>
                        <div className="h-12 w-12 rounded-[20px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                            <Utensils size={24} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black text-slate-900 dark:text-white font-outfit">
                            {todayCarbs} <span className="text-lg font-bold text-slate-400 dark:text-slate-500">g</span>
                        </div>
                        <p className="text-[10px] text-emerald-500 dark:text-emerald-400 mt-6 font-black uppercase tracking-widest opacity-60">Daily cumulative</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Chart Area */}
                <Card className="lg:col-span-8 border-none shadow-[0_32px_64px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[48px] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800">
                    <CardHeader className="pb-8 pt-10 px-10">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter dark:text-white">
                                    <TrendingUp className="text-emerald-600" size={32} />
                                    Glucose Trends
                                </CardTitle>
                                <CardDescription className="text-slate-400 dark:text-slate-500 font-medium">Visualizing biological patterns over time</CardDescription>
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
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="opacity-10" />
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
                                        itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="level"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#colorLevel)"
                                        strokeWidth={4}
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-700 border-4 border-dashed border-slate-50 dark:border-slate-800 rounded-[40px] bg-slate-50/30 dark:bg-slate-800/30">
                                <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-inner mb-6 transition-transform hover:scale-110 border border-slate-100 dark:border-slate-700">
                                    <Activity size={48} className="text-slate-200 dark:text-slate-700" />
                                </div>
                                <p className="font-black uppercase tracking-widest text-xs">No analytics available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Activity Feed */}
                <Card className="lg:col-span-4 border-none shadow-[0_32px_64px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[48px] bg-emerald-50/30 dark:bg-emerald-950/20 border-2 border-dashed border-emerald-100/50 dark:border-emerald-900/30">
                    <CardHeader className="pt-10 px-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-50 dark:border-slate-800">
                                <Clock size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black uppercase tracking-tighter dark:text-white">Activity</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Latest Updates</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-10">
                        <div className="space-y-5">
                            {activityFeed.length > 0 ? (
                                activityFeed.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-5 p-5 rounded-[32px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm transition-all hover:shadow-md hover:scale-[1.02] group border border-white dark:border-slate-800">
                                        <div className={cn(
                                            "h-12 w-12 rounded-[18px] flex items-center justify-center transition-all group-hover:scale-110 shadow-inner",
                                            item.value !== undefined ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" : "bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400"
                                        )}>
                                            {item.value !== undefined ? <Droplets size={20} /> : <Activity size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-800 dark:text-white leading-none text-base">
                                                {item.value !== undefined
                                                    ? `${item.value}`
                                                    : (item.names || []).join(', ')
                                                }
                                                <small className="text-[10px] ml-1 text-slate-400 dark:text-slate-500 font-bold uppercase">{item.value !== undefined ? 'mmol/L' : ''}</small>
                                            </p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1 opacity-60">
                                                {item.value !== undefined ? 'Glucose' : 'Symptoms'}
                                            </p>
                                        </div>
                                        <div className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-tighter bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full">
                                            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800 px-6">
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-full h-20 w-20 mx-auto flex items-center justify-center mb-6 shadow-inner border border-slate-100 dark:border-slate-700">
                                        <Clock size={32} className="text-slate-200 dark:text-slate-700" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Silent System</p>
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
