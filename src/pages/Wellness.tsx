import React, { useState } from 'react';
import { Activity, History } from 'lucide-react';
import { useHealthData } from '../hooks/useHealthData';

const Wellness: React.FC = () => {
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
        });
        setWeight('');
        setSleep('');
        setWater('');
    };

    return (
        <div className="wellness-page animate-fade-in">
            <header className="page-header">
                <h1>Wellness & Vitals</h1>
                <p className="text-muted">Track your physical health markers.</p>
            </header>

            <div className="wellness-grid">
                <div className="card input-card">
                    <div className="card-header">
                        <h3>Log Daily Vitals</h3>
                        <Activity size={20} className="text-blue-primary" />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Weight (kg)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="0.0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Sleep (hours)</label>
                            <input
                                type="number"
                                value={sleep}
                                onChange={(e) => setSleep(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Water (liters)</label>
                            <input
                                type="number"
                                value={water}
                                onChange={(e) => setWater(e.target.value)}
                                placeholder="0.0"
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary w-full mt-6" onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Vitals'}
                    </button>
                </div>

                <div className="card history-card">
                    <div className="card-header">
                        <h3>Vitals History</h3>
                        <History size={18} className="text-muted" />
                    </div>
                    <div className="history-list">
                        {entries.length === 0 && <p className="text-muted small">No logs yet.</p>}
                        {entries.map((entry) => (
                            <div key={entry.id} className="history-item">
                                <span className="date">{new Date(entry.timestamp).toLocaleDateString()}</span>
                                <div className="stats">
                                    <span>{entry.weight}kg</span>
                                    <span>{entry.sleep}h sleep</span>
                                    <span>{entry.water}L water</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .wellness-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
                .form-grid { display: grid; gap: 16px; margin-top: 16px; }
                .form-group label { display: block; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 6px; }
                .form-group input { width: 100%; padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-color); }
                .history-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
                .history-item { display: flex; flex-direction: column; gap: 4px; padding: 12px; background: var(--bg-app); border-radius: var(--radius-md); }
                .history-item .date { font-size: 0.75rem; color: var(--text-muted); }
                .history-item .stats { display: flex; gap: 12px; font-weight: 600; font-size: 0.9rem; }
                .mt-6 { margin-top: 1.5rem; }
                @media (max-width: 768px) { .wellness-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default Wellness;
