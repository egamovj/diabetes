import React, { useState } from 'react';
import { Activity, Thermometer, Wind, Eye, Droplets, Smile, Zap, Frown, Plus, Info } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { useHealthData } from '../hooks/useHealthData';

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

    // Calculate correlation for the chart
    const correlationData = glucoseEntries.map(g => {
        const gDate = new Date(g.timestamp);
        // Find symptoms within 2 hours of this glucose reading
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
        <div className="symptom-logger animate-fade-in">
            <header className="page-header">
                <h1>Symptoms & Wellbeing</h1>
                <p className="text-muted">Track how you feel and identify patterns</p>
            </header>

            <div className="symptom-layout">
                <div className="log-section">
                    <div className="card symptom-card">
                        <h3>How are you feeling?</h3>
                        <p className="text-muted small">Select any symptoms you are experiencing right now.</p>

                        <div className="symptom-grid">
                            {predefinedSymptoms.map((s) => (
                                <button
                                    key={s.id}
                                    className={`symptom-btn ${selectedSymptoms.includes(s.id) ? 'active' : ''}`}
                                    onClick={() => toggleSymptom(s.id)}
                                >
                                    <div className="icon-box">{s.icon}</div>
                                    <span>{s.name}</span>
                                </button>
                            ))}
                            <button
                                className={`symptom-btn dashed ${selectedSymptoms.includes('other') ? 'active' : ''}`}
                                onClick={() => {
                                    const custom = prompt('Enter symptom name:');
                                    if (custom) {
                                        // We'll treat 'other' as a flag and store the custom name in a separate field or just push to names
                                        setSelectedSymptoms(prev => [...prev, `custom:${custom}`]);
                                    }
                                }}
                            >
                                <div className="icon-box"><Plus size={20} /></div>
                                <span>Other</span>
                            </button>
                        </div>

                        <div className="severity-section">
                            <label>Overall Severity</label>
                            <div className="range-container">
                                <input
                                    type="range"
                                    min="1" max="5"
                                    value={severity}
                                    onChange={(e) => setSeverity(parseInt(e.target.value))}
                                />
                                <div className="range-labels">
                                    <span>Mild</span>
                                    <span>Moderate</span>
                                    <span>Severe</span>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary w-full mt-4" onClick={handleSave} disabled={loading || selectedSymptoms.length === 0}>
                            {loading ? 'Logging...' : 'Log Symptoms'}
                        </button>
                    </div>

                    <div className="card history-card">
                        <h3>Recent Symptoms</h3>
                        <div className="history-timeline">
                            {entries.length === 0 && <p className="text-muted small">No logs yet.</p>}
                            {entries.map((entry) => (
                                <div key={entry.id} className="timeline-item">
                                    <div className="timeline-date">
                                        {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="timeline-content">
                                        {(entry.names || []).map((name: string) => (
                                            <span key={name} className="badge-symptom">{name}</span>
                                        ))}
                                        <p className="small text-muted">{entry.severity === 5 ? 'Severe' : entry.severity >= 3 ? 'Moderate' : 'Mild'} severity</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="analytics-section">
                    <div className="card correlation-card">
                        <div className="card-header">
                            <h3>Symptom & Glucose Correlation</h3>
                            <Info size={16} className="text-muted" />
                        </div>
                        <p className="text-muted small mb-4">Visualizing how your glucose level affects your symptoms.</p>

                        <div className="chart-wrapper" style={{ height: '300px', minHeight: '300px' }}>
                            {correlationData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                        <XAxis
                                            type="number"
                                            dataKey="glucose"
                                            name="Glucose"
                                            unit=" mmol/L"
                                            domain={[0, 15]}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            type="number"
                                            dataKey="symptomCount"
                                            name="Symptoms"
                                            axisLine={false}
                                            tickLine={false}
                                            label={{ value: 'Symptom Count', angle: -90, position: 'insideLeft' }}
                                        />
                                        <ZAxis type="category" dataKey="name" name="Range" />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                        <Scatter name="Readings" data={correlationData} fill="var(--blue-primary)">
                                            {correlationData.map((entry, index) => (
                                                <circle key={index} cx={0} cy={0} r={6} fill={entry.glucose > 8.5 || entry.glucose < 4.0 ? 'var(--red-primary)' : 'var(--blue-primary)'} />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted border-2 border-dashed border-border rounded-xl p-4 text-center">
                                    <Info className="mb-2" size={24} />
                                    <p>Log both glucose and symptoms to see correlation data.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card insights-card">
                        <h3>Quick Insight</h3>
                        <div className="insight-box">
                            <div className="insight-icon"><Activity size={24} /></div>
                            <div className="insight-text">
                                <p>You tend to experience <strong>Fatigue</strong> and <strong>Dizziness</strong> when your glucose is above <strong>9.0 mmol/L</strong>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .symptom-logger { display: flex; flex-direction: column; gap: 24px; }
        .symptom-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

        .symptom-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin: 20px 0; }
        .symptom-btn { 
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);
          background: white; cursor: pointer; transition: 0.2s;
        }
        .symptom-btn:hover { background: var(--bg-app); transform: translateY(-2px); }
        .symptom-btn.active { border-color: var(--blue-primary); background: var(--blue-soft); color: var(--blue-primary); }
        .symptom-btn.dashed { border-style: dashed; }
        
        .icon-box { 
          width: 40px; height: 40px; border-radius: 10px; background: var(--bg-app); 
          display: flex; align-items: center; justify-content: center; color: var(--text-muted);
        }
        .symptom-btn.active .icon-box { background: var(--blue-primary); color: white; }

        .severity-section { margin-top: 24px; }
        .range-container { margin-top: 12px; }
        input[type="range"] { 
          width: 100%; height: 6px; border-radius: 3px; background: var(--border-color);
          appearance: none; outline: none; margin-bottom: 8px;
        }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none; width: 18px; height: 18px; border-radius: 50%;
          background: var(--blue-primary); cursor: pointer; border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .range-labels { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); }

        .history-timeline { display: flex; flex-direction: column; gap: 20px; margin-top: 16px; }
        .timeline-item { padding-left: 16px; border-left: 2px solid var(--border-color); position: relative; }
        .timeline-date { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px; }
        .badge-symptom { 
          display: inline-block; padding: 4px 10px; border-radius: 12px; background: var(--bg-app);
          font-size: 0.8rem; font-weight: 500; margin-right: 6px; margin-bottom: 6px;
        }

        .insight-box { display: flex; gap: 16px; align-items: center; padding: 16px; background: var(--blue-soft); border-radius: var(--radius-md); margin-top: 16px; }
        .insight-icon { color: var(--blue-primary); }
        .insight-text p { font-size: 0.9rem; line-height: 1.5; }

        @media (max-width: 1024px) {
          .symptom-layout { grid-template-columns: 1fr; }
        }
        .mt-4 { margin-top: 1rem; }
        .mb-4 { margin-bottom: 1rem; }
      `}</style>
        </div>
    );
};

export default SymptomLogger;
