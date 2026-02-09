import React, { useState, useEffect } from 'react';
import { Calculator, Utensils, Zap, History, Trash2, ArrowRight, Info } from 'lucide-react';

interface MealEntry {
    id: string;
    name: string;
    carbs: number;
    xe: number;
    insulin: number;
    timestamp: string;
}

const InsulinCalculator: React.FC = () => {
    const [foodName, setFoodName] = useState('');
    const [carbs, setCarbs] = useState<string>('');
    const [xeFactor, setXeFactor] = useState(12); // Default 12g per 1 XE
    const [insulinPerXe, setInsulinPerXe] = useState<string>('1.0');
    const [sensitivity, setSensitivity] = useState<string>('1.0');

    const [calculatedXe, setCalculatedXe] = useState(0);
    const [totalInsulin, setTotalInsulin] = useState(0);
    const [history, setHistory] = useState<MealEntry[]>([]);

    // Automatic Calculation
    useEffect(() => {
        const c = parseFloat(carbs) || 0;
        const xe = c / xeFactor;
        const iPerXe = parseFloat(insulinPerXe) || 0;

        setCalculatedXe(xe);
        setTotalInsulin(xe * iPerXe);
    }, [carbs, xeFactor, insulinPerXe]);

    const handleSaveMeal = () => {
        if (!foodName || !carbs) return;
        const newEntry: MealEntry = {
            id: Date.now().toString(),
            name: foodName,
            carbs: parseFloat(carbs),
            xe: calculatedXe,
            insulin: totalInsulin,
            timestamp: new Date().toISOString(),
        };
        setHistory([newEntry, ...history]);
        setFoodName('');
        setCarbs('');
    };

    return (
        <div className="insulin-calculator animate-fade-in">
            <header className="page-header">
                <h1>Insulin Calculator</h1>
                <p className="text-muted">Calculate dosage based on XE and individual factors</p>
            </header>

            <div className="calc-layout">
                <div className="main-calculator">
                    <div className="card calculator-card">
                        <div className="card-header">
                            <h3>New Meal Calculation</h3>
                            <Calculator size={20} className="text-blue-primary" />
                        </div>

                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Food Name / Description</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="e.g., Apple, Pasta with tomato sauce"
                                        value={foodName}
                                        onChange={(e) => setFoodName(e.target.value)}
                                    />
                                    <Utensils className="input-icon" size={20} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Carbohydrates (grams)</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={carbs}
                                        onChange={(e) => setCarbs(e.target.value)}
                                    />
                                    <span className="input-unit">g</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Insulin per 1 XE</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={insulinPerXe}
                                        onChange={(e) => setInsulinPerXe(e.target.value)}
                                    />
                                    <Zap className="input-icon" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="results-panel">
                            <div className="result-item">
                                <span className="res-label">Units of XE</span>
                                <span className="res-value">{calculatedXe.toFixed(1)} <small>XE</small></span>
                            </div>
                            <div className="result-divider"><ArrowRight size={20} /></div>
                            <div className="result-item highlighted">
                                <span className="res-label">Total Insulin Dose</span>
                                <span className="res-value">{totalInsulin.toFixed(1)} <small>Units</small></span>
                            </div>
                        </div>

                        <button className="btn btn-primary w-full mt-4" onClick={handleSaveMeal}>
                            Log Meal & Dosage
                        </button>
                    </div>

                    <div className="card settings-card mt-4">
                        <div className="card-header">
                            <h3>Personal Factors</h3>
                            <Info size={16} className="text-muted" />
                        </div>
                        <div className="settings-grid">
                            <div className="setting-item">
                                <label>1 XE = ? Grams Carbs</label>
                                <select value={xeFactor} onChange={(e) => setXeFactor(parseInt(e.target.value))}>
                                    <option value={10}>10g</option>
                                    <option value={12}>12g (Standard)</option>
                                    <option value={15}>15g</option>
                                </select>
                            </div>
                            <div className="setting-item">
                                <label>Insulin Sensitivity</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={sensitivity}
                                    onChange={(e) => setSensitivity(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="history-section">
                    <div className="card history-card">
                        <div className="card-header">
                            <h3>Meal History</h3>
                            <History size={18} className="text-muted" />
                        </div>

                        {history.length === 0 ? (
                            <div className="empty-state">
                                <Utensils size={40} className="text-muted" />
                                <p>No meals logged yet</p>
                            </div>
                        ) : (
                            <div className="history-list">
                                {history.map((item) => (
                                    <div key={item.id} className="meal-item">
                                        <div className="meal-info">
                                            <span className="meal-name">{item.name}</span>
                                            <span className="meal-meta">{item.carbs}g Carbs • {item.xe.toFixed(1)} XE</span>
                                        </div>
                                        <div className="meal-dosage">
                                            <span className="dosage-val">{item.insulin.toFixed(1)}</span>
                                            <span className="dosage-unit">Units</span>
                                        </div>
                                        <button className="delete-btn" onClick={() => setHistory(history.filter(h => h.id !== item.id))}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="card quick-tips mt-4">
                        <h3>Quick Tip</h3>
                        <p className="small text-muted">Carbohydrate Counting (XE) helps match your insulin dose to the amount of food you eat.</p>
                    </div>
                </div>
            </div>

            <style>{`
        .calc-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; margin-top: 24px; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
        .full-width { grid-column: 1 / -1; }
        
        .input-wrapper { position: relative; }
        .input-wrapper input, .input-wrapper select {
          width: 100%; padding: 12px 16px; border-radius: var(--radius-md);
          border: 1px solid var(--border-color); outline: none; font-weight: 600;
        }
        .input-unit { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-weight: 500; }
        
        .results-panel { 
          display: flex; align-items: center; justify-content: space-between;
          background: var(--bg-app); padding: 24px; border-radius: var(--radius-md);
          margin-top: 24px; border: 1px dashed var(--border-color);
        }
        .result-item { display: flex; flex-direction: column; }
        .res-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .res-value { font-size: 1.5rem; font-weight: 800; font-family: 'Outfit'; }
        .res-value small { font-size: 0.875rem; color: var(--text-muted); }
        .result-item.highlighted .res-value { color: var(--blue-primary); }
        .result-divider { color: var(--border-color); }

        .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
        .setting-item label { display: block; font-size: 0.75rem; margin-bottom: 4px; color: var(--text-muted); }
        .setting-item input, .setting-item select { width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); }

        .history-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
        .meal-item { 
          display: flex; align-items: center; gap: 12px; padding: 12px 16px;
          border-radius: var(--radius-md); background: var(--bg-app);
          transition: 0.2s;
        }
        .meal-info { flex: 1; display: flex; flex-direction: column; }
        .meal-name { font-weight: 600; font-size: 0.95rem; }
        .meal-meta { font-size: 0.75rem; color: var(--text-muted); }
        .meal-dosage { text-align: right; }
        .dosage-val { display: block; font-weight: 700; color: var(--blue-primary); font-size: 1.1rem; }
        .dosage-unit { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; }
        .delete-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 4px; }
        .delete-btn:hover { color: var(--red-primary); background: var(--red-soft); }

        .empty-state { text-align: center; padding: 40px 0; color: var(--text-muted); }
        
        @media (max-width: 1024px) {
          .calc-layout { grid-template-columns: 1fr; }
        }
        .w-full { width: 100%; }
        .mt-4 { margin-top: 1rem; }
      `}</style>
        </div>
    );
};

export default InsulinCalculator;
