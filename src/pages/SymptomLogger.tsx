import React, { useState } from 'react';
import { Activity, Thermometer, Wind, Eye, Droplets, Smile, Zap, Frown, Plus, Info } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';

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

const mockCorrelation = [
    { glucose: 4.2, symptomCount: 1, name: 'Normal' },
    { glucose: 5.8, symptomCount: 0, name: 'Normal' },
    { glucose: 8.9, symptomCount: 2, name: 'High' },
    { glucose: 11.2, symptomCount: 4, name: 'Very High' },
    { glucose: 3.1, symptomCount: 5, name: 'Very Low' },
];

const SymptomLogger: React.FC = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [severity, setSeverity] = useState(2);

    const toggleSymptom = (id: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

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
                            <button className="symptom-btn dashed">
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

                        <button className="btn btn-primary w-full mt-4">
                            Log Symptoms
                        </button>
                    </div>

                    <div className="card history-card">
                        <h3>Recent Symptoms</h3>
                        <div className="history-timeline">
                            <div className="timeline-item">
                                <div className="timeline-date">Today, 08:30</div>
                                <div className="timeline-content">
                                    <span className="badge-symptom">Fatigue</span>
                                    <span className="badge-symptom">Sweating</span>
                                    <p className="small text-muted">Moderate severity</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-date">Yesterday, 19:45</div>
                                <div className="timeline-content">
                                    <span className="badge-symptom">Dizziness</span>
                                    <p className="small text-muted">Mild severity</p>
                                </div>
                            </div>
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

                        <div className="chart-wrapper" style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
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
                                    <Scatter name="Readings" data={mockCorrelation} fill="var(--blue-primary)">
                                        {mockCorrelation.map((entry, index) => (
                                            <circle key={index} cx={0} cy={0} r={6} fill={entry.glucose > 8.5 || entry.glucose < 4.0 ? 'var(--red-primary)' : 'var(--blue-primary)'} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
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
