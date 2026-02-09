import React, { createContext, useContext, useState } from 'react';

export type GlucoseUnit = 'mmol/L' | 'mg/dL';

interface UnitContextType {
    unit: GlucoseUnit;
    setUnit: (unit: GlucoseUnit) => void;
    convert: (value: number) => number;
    format: (value: number) => string;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unit, setUnitState] = useState<GlucoseUnit>(
        (localStorage.getItem('diabetes-unit') as GlucoseUnit) || 'mmol/L'
    );

    const setUnit = (newUnit: GlucoseUnit) => {
        setUnitState(newUnit);
        localStorage.setItem('diabetes-unit', newUnit);
    };

    // Standard internal storage is mmol/L
    const convert = (value: number) => {
        if (unit === 'mg/dL') {
            return parseFloat((value * 18.0182).toFixed(1));
        }
        return value;
    };

    const format = (value: number) => {
        return `${convert(value)} ${unit}`;
    };

    return (
        <UnitContext.Provider value={{ unit, setUnit, convert, format }}>
            {children}
        </UnitContext.Provider>
    );
};

export const useUnit = () => {
    const context = useContext(UnitContext);
    if (!context) throw new Error('useUnit must be used within a UnitProvider');
    return context;
};
