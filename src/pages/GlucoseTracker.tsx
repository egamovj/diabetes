import React, { useState } from 'react';
import { Droplets, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface GlucoseEntry {
    id: string;
    value: number;
    type: string;
    timestamp: string;
    notes?: string;
}

const mockHistory: GlucoseEntry[] = [
    { id: '1', value: 5.4, type: 'Before Meal', timestamp: '2026-02-09T08:00:00' },
    { id: '2', value: 7.8, type: 'After Meal', timestamp: '2026-02-09T12:30:00' },
    { id: '3', value: 6.2, type: 'Before Sleep', timestamp: '2026-02-08T23:00:00' },
    { id: '4', value: 4.1, type: 'Fast', timestamp: '2026-02-08T07:15:00' },
];

const GlucoseTracker: React.FC = () => {
    const [level, setLevel] = useState<string>('');
    const [type, setType] = useState<string>('Before Meal');
    const [entries, setEntries] = useState<GlucoseEntry[]>(mockHistory);

    const handleAddEntry = () => {
        if (!level) return;
        const newEntry: GlucoseEntry = {
            id: Date.now().toString(),
            value: parseFloat(level),
            type,
            timestamp: new Date().toISOString(),
        };
        setEntries([newEntry, ...entries]);
        setLevel('');
    };

    const getStatus = (val: number) => {
        if (val < 4.0) return { label: 'Low', color: 'var(--red-primary)', icon: <AlertCircle size={16} /> };
        if (val > 8.5) return { label: 'High', color: 'var(--yellow-primary)', icon: <Info size={16} /> };
        return { label: 'Normal', color: 'var(--green-primary)', icon: <CheckCircle2 size={16} /> };
    };

    return (
        <div className="glucose-tracker animate-fade-in">
            <header className="page-header">
                <h1>Blood Glucose</h1>
                <p className="text-muted">Track and analyze your sugar levels</p>
            </header>

            <div className="tracker-layout">
                <div className="input-section">
                    <div className="card input-card">
                        <h3>Add New Reading</h3>
                        <div className="form-group">
                            <label>Glucose Level (mmol/L)</label>
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                />
                                <Droplets className="input-icon" size={20} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Time Period</label>
                            <div className="type-chips">
                                {['Fast', 'Before Meal', 'After Meal', 'Before Sleep'].map((t) => (
                                    <button
                                        key={t}
                                        className={`chip ${type === t ? 'active' : ''}`}
                                        onClick={() => setType(t)}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="btn btn-primary w-full" onClick={handleAddEntry}>
                            Save Reading
                        </button>
                    </div>

                    <div className="card guide-card">
                        <h3>Reference Ranges</h3>
                        <div className="range-item">
                            <span className="dot green"></span>
                            <span className="range-label">Normal</span>
                            <span className="range-val">4.0 - 7.0 mmol/L</span>
                        </div>
                        <div className="range-item">
                            <span className="dot yellow"></span>
                            <span className="range-label">High</span>
                            <span className="range-val">&gt; 8.5 mmol/L</span>
                        </div>
                        <div className="range-item">
                            <span className="dot red"></span>
                            <span className="range-label">Critical (Low)</span>
                            <span className="range-val">&lt; 3.5 mmol/L</span>
                        </div>
                    </div>
                </div>

                <div className="chart-history-section">
                    <div className="card chart-details">
                        <div className="chart-header">
                            <h3>History Trend</h3>
                            <select className="period-select">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="chart-wrapper" style={{ height: '350px', marginTop: '30px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[...entries].reverse()}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                    <XAxis
                                        dataKey="timestamp"
                                        tickFormatter={(str) => new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis axisLine={false} tickLine={false} domain={[0, 15]} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <ReferenceLine y={4} stroke="var(--green-primary)" strokeDasharray="3 3" />
                                    <ReferenceLine y={8.5} stroke="var(--yellow-primary)" strokeDasharray="3 3" />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="var(--blue-primary)"
                                        strokeWidth={4}
                                        dot={{ r: 6, fill: 'var(--blue-primary)', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="history-list">
                        <h3>Recent Readings</h3>
                        {entries.map((entry) => {
                            const status = getStatus(entry.value);
                            return (
                                <div key={entry.id} className="card history-item">
                                    <div className="item-main">
                                        <div className="val-box" style={{ background: status.color + '20', color: status.color }}>
                                            {entry.value}
                                        </div>
                                        <div className="item-meta">
                                            <span className="item-type">{entry.type}</span>
                                            <span className="item-time">
                                                {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="item-status" style={{ color: status.color }}>
                                        {status.icon}
                                        <span>{status.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style>{`
        .glucose-tracker { display: flex; flex-direction: column; gap: 24px; }
        .tracker-layout { display: grid; grid-template-columns: 350px 1fr; gap: 24px; }
        
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 0.9rem; color: var(--text-muted); }
        
        .input-wrapper { position: relative; }
        .input-wrapper input { 
          width: 100%; padding: 14px 16px; padding-right: 48px;
          border-radius: var(--radius-md); border: 1px solid var(--border-color);
          font-size: 1.1rem; font-weight: 600; outline: none; transition: 0.2s;
        }
        .input-wrapper input:focus { border-color: var(--blue-primary); box-shadow: 0 0 0 4px hsla(200, 85%, 60%, 0.1); }
        .input-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--blue-primary); }

        .type-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip { 
          padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border-color);
          background: white; cursor: pointer; font-size: 0.85rem; font-weight: 500;
          transition: 0.2s;
        }
        .chip.active { background: var(--blue-primary); color: white; border-color: var(--blue-primary); }

        .guide-card { margin-top: 24px; }
        .range-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border-color); }
        .range-item:last-child { border: none; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot.green { background: var(--green-primary); }
        .dot.yellow { background: var(--yellow-primary); }
        .dot.red { background: var(--red-primary); }
        .range-label { flex: 1; font-weight: 500; }
        .range-val { color: var(--text-muted); font-size: 0.85rem; }

        .chart-header { display: flex; justify-content: space-between; align-items: center; }
        .period-select { padding: 6px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: white; outline: none; }

        .history-list { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; }
        .history-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; transition: 0.2s; cursor: pointer; }
        .history-item:hover { transform: scale(1.01); }
        
        .item-main { display: flex; align-items: center; gap: 16px; }
        .val-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; }
        .item-meta { display: flex; flex-direction: column; }
        .item-type { font-weight: 600; font-size: 0.95rem; }
        .item-time { font-size: 0.8rem; color: var(--text-muted); }
        .item-status { display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 0.85rem; }

        @media (max-width: 1024px) {
          .tracker-layout { grid-template-columns: 1fr; }
        }
        .w-full { width: 100%; }
      `}</style>
        </div>
    );
};

export default GlucoseTracker;
