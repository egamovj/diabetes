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
export const getHbA1cStatus = (hbA1c: number) => {
    if (hbA1c < 5.7) return { label: 'Optimal', color: 'text-emerald-500', bgColor: 'bg-emerald-50' };
    if (hbA1c < 6.5) return { label: 'Pre-diabetic', color: 'text-amber-500', bgColor: 'bg-amber-50' };
    return { label: 'Diabetic Range', color: 'text-red-500', bgColor: 'bg-red-50' };
};

/**
 * Calculates Time In Range percentages based on glucose entries
 */
export const calculateTIR = (glucoseValues: number[]) => {
    if (glucoseValues.length === 0) return { inRange: 0, high: 0, low: 0 };

    const low = glucoseValues.filter(v => v < 4.0).length;
    const inRange = glucoseValues.filter(v => v >= 4.0 && v <= 8.5).length;
    const high = glucoseValues.filter(v => v > 8.5).length;

    const total = glucoseValues.length;
    return {
        low: Math.round((low / total) * 100),
        inRange: Math.round((inRange / total) * 100),
        high: Math.round((high / total) * 100)
    };
};

/**
 * Correlates meal logs with subsequent glucose readings (within 2 hours)
 */
export const correlateMealData = (meals: any[], glucose: any[]) => {
    return meals.map(meal => {
        const mealTime = new Date(meal.timestamp).getTime();
        const postMealReading = glucose
            .filter(g => {
                const gTime = new Date(g.timestamp).getTime();
                const diff = gTime - mealTime;
                return diff > 0 && diff <= 120 * 60 * 1000; // Within 2 hours
            })
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0];

        return {
            ...meal,
            postGlucose: postMealReading?.value || null
        };
    }).filter(m => m.postGlucose !== null);
};
