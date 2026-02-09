import React, { useState, useEffect } from 'react';
import { Calculator, Utensils, History, Info, Settings2, Activity, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useHealthData } from '../hooks/useHealthData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from '../contexts/LanguageContext';
import { useUnit } from '../contexts/UnitContext';

const InsulinCalculator: React.FC = () => {
    const { t } = useLanguage();
    const { unit } = useUnit();
    const [carbs, setCarbs] = useState<string>('');
    const [xeFactor, setXeFactor] = useState(12); // Default 12g per 1 XE
    const [insulinPerXe] = useState<string>('1.0');
    const [glucose, setGlucose] = useState<string>('');
    const [sensitivity, setSensitivity] = useState<string>('1.0');

    const [calculatedXe, setCalculatedXe] = useState(0);
    const [totalInsulin, setTotalInsulin] = useState(0);
    const { data: entries, addEntry, loading } = useHealthData('meal');

    // Automatic Calculation
    useEffect(() => {
        const c = parseFloat(carbs) || 0;
        const xe = c / xeFactor;
        const iPerXe = parseFloat(insulinPerXe) || 0;

        setCalculatedXe(xe);
        setTotalInsulin(xe * iPerXe);
    }, [carbs, xeFactor, insulinPerXe]);

    const handleSave = async () => {
        if (!carbs) return;
        await addEntry({
            carbs: parseFloat(carbs),
            xe: calculatedXe,
            insulin: totalInsulin,
            insulinPerXe: parseFloat(insulinPerXe),
            xeFactor,
            glucose: parseFloat(glucose) || undefined,
            dose: totalInsulin,
            timestamp: new Date().toISOString(),
        });
        setCarbs('');
        setGlucose('');
    };

    return (
        <div className="relative space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Background Decorative Element */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-100/20 rounded-full blur-[100px] -z-10"></div>

            <header className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-3">
                    <div className="h-1 bg-emerald-500 w-12 rounded-full"></div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 font-bold uppercase tracking-widest text-[10px] px-3">{t('dosage_calc')}</Badge>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 font-outfit uppercase leading-none drop-shadow-sm">
                    {t('insulin')} <span className="text-emerald-600">{t('insulin_precision')}</span>
                </h1>
                <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">
                    {t('accurate_dose_prediction')}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
                {/* Calculator Area */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-10">
                    <Card className="border-none shadow-[0_32px_64px_-12px_rgba(16,185,129,0.1)] overflow-hidden bg-gradient-to-b from-white to-emerald-50/20 rounded-[40px] group border-t border-white">
                        <CardHeader className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white pb-14 pt-10 px-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                                <Calculator size={120} strokeWidth={1} />
                            </div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-none text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-tighter">{t('algorithmic_base')}</Badge>
                                    </div>
                                    <CardTitle className="text-2xl font-black flex items-center gap-3 font-outfit uppercase">{t('dosage_board')}</CardTitle>
                                    <CardDescription className="text-emerald-100 text-xs font-medium opacity-90">{t('calc_optimal_units')}</CardDescription>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl animate-bounce-slow">
                                    <Settings2 size={24} className="text-emerald-200" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="-mt-10 bg-white/80 backdrop-blur-md rounded-t-[48px] pt-12 px-10 pb-10 space-y-8 relative z-10 border-t border-emerald-100/50">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-slate-500 font-black ml-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                        <Utensils size={14} className="text-emerald-500" />
                                        {t('total_xe')}
                                    </Label>
                                    <Input
                                        type="number"
                                        placeholder="0.0"
                                        className="h-16 rounded-[20px] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[6px] focus:ring-emerald-500/10 transition-all font-outfit font-black text-xl border-2"
                                        value={carbs}
                                        onChange={(e) => setCarbs(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-slate-500 font-black ml-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                        <Activity size={14} className="text-emerald-500" />
                                        {t('current_glucose')}
                                    </Label>
                                    <Input
                                        type="number"
                                        placeholder={`0.0 ${unit}`}
                                        className="h-16 rounded-[20px] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[6px] focus:ring-emerald-500/10 transition-all font-outfit font-black text-xl border-2"
                                        value={glucose}
                                        onChange={(e) => setGlucose(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Card className="border-none bg-emerald-600 shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)] overflow-hidden relative group rounded-[32px]">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                                <CardContent className="p-8 flex items-center justify-between relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em]">{t('suggested_dose')}</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-white font-outfit leading-none">{totalInsulin.toFixed(1)}</span>
                                            <span className="text-sm font-black text-emerald-200 uppercase tracking-widest">{t('units')}</span>
                                        </div>
                                    </div>
                                    <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-xl">
                                        <ChevronRight size={28} className="text-white" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Button
                                className="w-full h-18 rounded-[24px] text-base font-black bg-slate-900 hover:bg-slate-800 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-all gap-3 py-8 group/btn relative overflow-hidden"
                                onClick={handleSave}
                                disabled={loading || !carbs}
                            >
                                <span className="relative z-10 flex items-center gap-3 italic uppercase text-white">
                                    {loading ? t('archiving') : t('sync_meal_journal')}
                                    <CheckCircle2 size={20} className="text-emerald-400 animate-pulse" />
                                </span>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-slate-900 text-white overflow-hidden group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 opacity-70">
                                <Settings2 size={16} />
                                {t('calibration_factors')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('xe_standardization')}</Label>
                                <select
                                    className="w-full bg-white/10 border-none rounded-xl h-11 px-4 font-bold focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                    value={xeFactor}
                                    onChange={(e) => setXeFactor(parseInt(e.target.value))}
                                >
                                    <option value={10} className="text-slate-900">10g / XE</option>
                                    <option value={12} className="text-slate-900">12g / XE ({t('standard')})</option>
                                    <option value={15} className="text-slate-900">15g / XE</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('correction_factor')}</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    className="bg-white/10 border-none rounded-xl h-11 px-4 font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={sensitivity}
                                    onChange={(e) => setSensitivity(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* History Section */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                                <History size={16} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tighter">{t('meal_journal')}</h3>
                        </div>
                        {entries.length > 0 && (
                            <Badge variant="outline" className="text-[10px] font-black border-slate-200 text-slate-500 uppercase px-2 py-0.5">
                                {entries.length} {t('logs_count')}
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-4">
                        {entries.length === 0 ? (
                            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-100 p-12 text-center space-y-4">
                                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto transition-colors group-hover:bg-blue-50">
                                    <Utensils size={32} className="text-slate-200" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">{t('journal_empty')}</p>
                                    <p className="text-slate-400 text-sm">{t('start_logging_meals')}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {entries.map((item) => (
                                    <Card key={item.id} className="border-none shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-blue-100/30 transition-all group overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="flex items-stretch h-20">
                                                <div className="w-2 bg-blue-600"></div>
                                                <div className="flex-1 px-5 flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="font-black text-slate-900 line-clamp-1">{item.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <Badge className="bg-slate-100 text-slate-500 text-[9px] font-black border-none uppercase py-0 px-2 h-4">
                                                                {item.carbs}{t('carbs_g')}
                                                            </Badge>
                                                            <span className="text-slate-300 text-[10px] uppercase font-bold tracking-widest">
                                                                {item.xe?.toFixed(1)} XE
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end">
                                                        <span className="text-2xl font-black text-blue-600 font-outfit">{item.insulin?.toFixed(1)}</span>
                                                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{t('units')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    <Card className="border-none shadow-2xl shadow-blue-100/20 bg-blue-50 p-6 rounded-3xl group">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                                <Info size={20} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-black text-blue-900 text-sm uppercase tracking-widest">{t('expert_tip')}</h4>
                                <p className="text-xs leading-relaxed text-blue-700/80 font-medium italic">
                                    {t('accuracy_matters_tip')}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InsulinCalculator;
