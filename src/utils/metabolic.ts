/**
 * Clinical formula to project HbA1c from average glucose (mmol/L).
 * HbA1c (%) = (Avg Glucose mmol/L + 2.59) / 1.59
 */
export const calculateHbA1c = (avgGlucose: number): number => {
    if (avgGlucose <= 0) return 0;
    return parseFloat(((avgGlucose + 2.59) / 1.59).toFixed(1));
};

/**
 * Compares averages of two periods (default 14 days) to determine trend.
 */
export const calculateTrend = (currentData: number[], previousData: number[]) => {
    if (currentData.length === 0 || previousData.length === 0) return 'stable';

    const currentAvg = currentData.reduce((a, b) => a + b, 0) / currentData.length;
    const previousAvg = previousData.reduce((a, b) => a + b, 0) / previousData.length;

    const diff = currentAvg - previousAvg;
    const threshold = 0.5; // mmol/L threshold for significant change

    if (diff > threshold) return 'rising';
    if (diff < -threshold) return 'falling';
    return 'stable';
};

/**
 * Gets the color and status text for HbA1c levels.
 */
export const getHbA1cStatus = (hba1c: number) => {
    if (hba1c < 5.7) return { label: 'Optimal', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (hba1c < 6.5) return { label: 'Pre-diabetic', color: 'text-amber-500', bg: 'bg-amber-50' };
    return { label: 'Diabetic Range', color: 'text-red-500', bg: 'bg-red-50' };
};
