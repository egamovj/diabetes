import React from 'react';
import { Flame, Utensils, Droplets, TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHealthData } from '../hooks/useHealthData';

const Dashboard: React.FC = () => {
    const { data: glucoseEntries } = useHealthData('glucose');
    const { data: symptomEntries } = useHealthData('symptom');
    const { data: mealEntries } = useHealthData('meal');

    const latestGlucose = glucoseEntries[0]?.value || 0;
    const avgGlucose = glucoseEntries.length > 0
        ? (glucoseEntries.reduce((acc, g) => acc + g.value, 0) / glucoseEntries.length).toFixed(1)
        : '0.0';

    // Total carbs today (simplified)
    const todayCarbs = mealEntries.reduce((acc, m) => acc + (m.carbs || 0), 0);
    const totalInsulin = mealEntries.reduce((acc, m) => acc + (m.insulin || 0), 0);

    // Chart data: map glucose readings
    const chartData = [...glucoseEntries].reverse().map(g => ({
        time: g.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        level: g.value
    })).slice(-10);

    return (
        <div className="dashboard-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>Health Summary</h1>
                    <p className="text-muted">Real-time insights from your trackers.</p>
                </div>
            </header>

            <section className="stats-grid">
                <div className="card stat-card main-stat">
                    <div className="stat-header">
                        <Droplets className="text-blue-primary" size={24} />
                        <span className="stat-label">Latest Glucose</span>
                    </div>
                    <div className="stat-value">{latestGlucose} <small>mmol/L</small></div>
                    <div className="stat-footer text-green">
                        <TrendingUp size={16} />
                        <span>Avg: {avgGlucose}</span>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-header">
                        <Flame className="text-orange" size={24} />
                        <span className="stat-label">Insulin (Total)</span>
                    </div>
                    <div className="stat-value">{totalInsulin.toFixed(1)} <small>Units</small></div>
                </div>

                <div className="card stat-card">
                    <div className="stat-header">
                        <Utensils className="text-green" size={24} />
                        <span className="stat-label">Carbs Tracked</span>
                    </div>
                    <div className="stat-value">{todayCarbs} <small>g</small></div>
                </div>
            </section>

            <div className="main-grid">
                <div className="card chart-card">
                    <div className="card-header">
                        <h3>Glucose Trends</h3>
                    </div>
                    <div className="chart-container" style={{ height: '300px', marginTop: '20px', minHeight: '300px' }}>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--blue-primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--blue-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} domain={[0, 15]} />
                                    <Tooltip contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                                    <Area type="monotone" dataKey="level" stroke="var(--blue-primary)" fillOpacity={1} fill="url(#colorLevel)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted border-2 border-dashed border-border rounded-xl">
                                No glucose data available yet
                            </div>
                        )}
                    </div>
                </div>

                <div className="card activity-card">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                    </div>
                    <div className="activity-list">
                        {[...glucoseEntries, ...symptomEntries]
                            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                            .slice(0, 8)
                            .map((item: any) => (
                                <div key={item.id} className="activity-item">
                                    <div className={`activity-icon ${item.value !== undefined ? 'blue' : 'orange'}`}>
                                        {item.value !== undefined ? <Droplets size={16} /> : <Activity size={16} />}
                                    </div>
                                    <div className="activity-content">
                                        <p>
                                            {item.value !== undefined
                                                ? `Glucose: ${item.value} mmol/L`
                                                : `Symptom: ${(item.names || []).join(', ')}`
                                            }
                                        </p>
                                        <span>{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            ))}
                        {glucoseEntries.length === 0 && symptomEntries.length === 0 && (
                            <p className="text-muted small text-center p-4">No recent activity detected.</p>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-page { display: flex; flex-direction: column; gap: 32px; }
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
                .stat-card { padding: 24px; border-radius: var(--radius-lg); background: white; border: 1px solid var(--border-color); }
                .stat-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
                .stat-label { color: var(--text-muted); font-size: 0.875rem; }
                .stat-value { font-size: 2rem; font-weight: 700; font-family: 'Outfit'; }
                .stat-value small { font-size: 1rem; color: var(--text-muted); }
                .main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
                .activity-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
                .activity-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: var(--radius-md); background: var(--bg-app); }
                .activity-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
                .activity-icon.blue { background: var(--blue-soft); color: var(--blue-primary); }
                .activity-content p { font-size: 0.875rem; font-weight: 600; }
                .activity-content span { font-size: 0.75rem; color: var(--text-muted); }
                @media (max-width: 1024px) { .main-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default Dashboard;
