import React from 'react';
import { Plus, Flame, Utensils, Droplets, TrendingUp, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
    { time: '08:00', level: 5.4 },
    { time: '12:00', level: 7.2 },
    { time: '16:00', level: 6.1 },
    { time: '20:00', level: 8.5 },
    { time: '23:00', level: 5.9 },
];

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>Welcome back, Alex</h1>
                    <p className="text-muted">Here's your summary for today.</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={20} />
                    <span>New Entry</span>
                </button>
            </header>

            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon blue">
                        <Droplets size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">Last Reading</span>
                        <span className="value">5.9 <small>mmol/L</small></span>
                    </div>
                    <div className="stat-trend neutral">Normal</div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon green">
                        <Flame size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">Insulin Today</span>
                        <span className="value">12 <small>Units</small></span>
                    </div>
                    <div className="stat-trend">2 Basal, 10 Bolus</div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon yellow">
                        <Utensils size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">Carbs Tracked</span>
                        <span className="value">145 <small>g</small></span>
                    </div>
                    <div className="stat-trend">12.1 XE</div>
                </div>
            </div>

            <div className="main-grid">
                <div className="card chart-card">
                    <div className="card-header">
                        <h3>Glucose Trends</h3>
                        <div className="card-actions">
                            <span className="badge">Today</span>
                        </div>
                    </div>
                    <div className="chart-container" style={{ height: '300px', marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockData}>
                                <defs>
                                    <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--blue-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--blue-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                    domain={[0, 15]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 'var(--radius-md)',
                                        border: 'none',
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="level"
                                    stroke="var(--blue-primary)"
                                    fillOpacity={1}
                                    fill="url(#colorLevel)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card alert-card">
                    <div className="card-header">
                        <h3>Recent Alerts</h3>
                    </div>
                    <div className="alerts-list">
                        <div className="alert-item high">
                            <div className="alert-icon">
                                <AlertCircle size={18} />
                            </div>
                            <div className="alert-content">
                                <p>High Glucose detected at 20:00</p>
                                <span>8.5 mmol/L after dinner</span>
                            </div>
                        </div>
                        <div className="alert-item note">
                            <div className="alert-icon">
                                <TrendingUp size={18} />
                            </div>
                            <div className="alert-content">
                                <p>Weekly Target Reached</p>
                                <span>75% readings in normal range</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.blue { background: var(--blue-soft); color: var(--blue-primary); }
        .stat-icon.green { background: var(--green-soft); color: var(--green-primary); }
        .stat-icon.yellow { background: var(--yellow-soft); color: var(--yellow-primary); }

        .stat-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .stat-info .label {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .stat-info .value {
          font-size: 1.5rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
        }

        .stat-trend {
          font-size: 0.75rem;
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 20px;
          color: var(--text-muted);
        }

        .stat-trend.neutral { background: var(--green-soft); color: var(--green-primary); }

        .main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .badge {
          background: var(--blue-soft);
          color: var(--blue-primary);
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        .alert-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: var(--radius-sm);
          background: var(--bg-app);
        }

        .alert-item.high { border-left: 4px solid var(--red-primary); }
        .alert-item.note { border-left: 4px solid var(--blue-primary); }

        .alert-icon { color: var(--text-muted); }
        .alert-content p { font-size: 0.875rem; font-weight: 600; margin-bottom: 2px; }
        .alert-content span { font-size: 0.75rem; color: var(--text-muted); }

        @media (max-width: 1024px) {
          .main-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .page-header .btn { width: 100%; }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
