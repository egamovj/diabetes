import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, Phone, Activity, Droplets, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MedicalID {
    diabetesType: string;
    bloodType: string;
    emergencyContact: string;
    notes: string;
}

const SOSModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [medicalID, setMedicalID] = useState<MedicalID | null>(null);
    const [lastReading, setLastReading] = useState<string | null>(null);

    useEffect(() => {
        // Load data from localStorage for offline safety
        const savedID = localStorage.getItem('diabetes-medical-id');
        if (savedID) setMedicalID(JSON.parse(savedID));

        const readings = localStorage.getItem('diabetes-health-data-glucose');
        if (readings) {
            const data = JSON.parse(readings);
            if (data.length > 0) setLastReading(`${data[data.length - 1].value} mmol/L`);
        }

        (window as any).triggerSOS = () => setIsOpen(true);
    }, []);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-red-950/40 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-lg"
                >
                    <Card className="border-none shadow-[0_40px_100px_rgba(220,38,38,0.3)] bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden">
                        <CardHeader className="bg-red-600 text-white p-10 pb-16 relative">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-8 right-8 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center animate-pulse">
                                    <ShieldAlert size={48} />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black uppercase font-outfit tracking-tighter">Emergency Medical ID</h2>
                                    <p className="text-red-100 font-medium text-sm">Vital instructions for first responders</p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="-mt-10 bg-white dark:bg-slate-900 rounded-t-[48px] p-10 space-y-8 relative z-10 border-t border-red-500/20">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-[32px] bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 flex flex-col items-center gap-2">
                                    <Activity className="text-red-600 dark:text-red-400" size={24} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Condition</span>
                                    <span className="text-lg font-black text-red-600 dark:text-red-400 font-outfit uppercase">{medicalID?.diabetesType || 'Diabetes Type 1'}</span>
                                </div>
                                <div className="p-6 rounded-[32px] bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 flex flex-col items-center gap-2">
                                    <Droplets className="text-red-600 dark:text-red-400" size={24} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Blood Group</span>
                                    <span className="text-lg font-black text-red-600 dark:text-red-400 font-outfit uppercase">{medicalID?.bloodType || 'B+ Positive'}</span>
                                </div>
                            </div>

                            <Card className="border-none shadow-xl shadow-slate-200/20 dark:shadow-none dark:bg-slate-800/50 rounded-3xl p-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white">
                                        <Activity size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Glycemic Data</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white font-outfit">{lastReading || 'Stable (Estimated)'}</p>
                                    </div>
                                </div>
                                <div className="h-px bg-slate-100 dark:bg-slate-700 w-full" />
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                                        <Phone size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white font-outfit">{medicalID?.emergencyContact || '+1 (234) 567-890'}</p>
                                    </div>
                                </div>
                            </Card>

                            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                    <Info size={14} />
                                    Therapeutic Notes
                                </p>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                    {medicalID?.notes || "Patient may require rapid-acting glucose or insulin depending on state. Check sensor for continuous monitoring."}
                                </p>
                            </div>

                            <Button
                                className="w-full h-18 rounded-3xl bg-slate-900 text-white font-black uppercase tracking-tighter"
                                onClick={() => setIsOpen(false)}
                            >
                                Acknowledge & Return
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SOSModal;
