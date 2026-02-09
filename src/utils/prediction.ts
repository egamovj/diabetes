import type { HealthEntry } from '../hooks/useHealthData';

export type RiskLevel = 'STABLE' | 'WATCHFUL' | 'CRITICAL' | 'OPTIMAL';

export interface PredictionResult {
    riskLevel: RiskLevel;
    projectedValue: number;
    velocity: number; // mmol/L per hour
    message: string;
    advice: string;
}

/**
 * High-precision trend analysis for glucose prediction.
 * Uses the last 3 readings to calculate velocity and path.
 */
export const analyzeGlucoseTrend = (entries: HealthEntry[]): PredictionResult => {
    // We need at least 2 entries for velocity, 3 for better accuracy
    if (entries.length < 2) {
        return {
            riskLevel: 'STABLE',
            projectedValue: entries[0]?.value || 0,
            velocity: 0,
            message: "Awaiting biological calibration...",
            advice: "Add more readings for AI predictive insights."
        };
    }

    const latest = entries[0];
    const previous = entries[1];

    // Calculate velocity in mmol/L per hour
    const timeDiffMs = latest.timestamp.getTime() - previous.timestamp.getTime();
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
    const valueDiff = latest.value - previous.value;

    // Velocity is change per hour
    const velocity = timeDiffHours > 0 ? valueDiff / timeDiffHours : 0;

    // Project 60 minutes into the future
    const projectedValue = parseFloat((latest.value + velocity).toFixed(1));

    let riskLevel: RiskLevel = 'STABLE';
    let message = "System status within nominal range.";
    let advice = "Continue standard metabolic monitoring.";

    if (latest.value >= 4.0 && latest.value <= 8.5) {
        riskLevel = 'OPTIMAL';
        message = "Metabolic equilibrium achieved.";
        advice = "Biometric stability detected.";
    }

    // Hypoglycemia prediction (The primary goal)
    if (projectedValue < 4.4) {
        riskLevel = 'WATCHFUL';
        message = "Biological trend approaching threshold.";
        advice = "Consider a proactive fast-acting carb intake (15g).";
    }

    if (projectedValue < 3.9 || (velocity < -2 && latest.value < 6)) {
        riskLevel = 'CRITICAL';
        message = "Rapid downward trajectory detected.";
        advice = "Immediate clinical action advised. Verify with fingerstick.";
    }

    // Hyperglycemia warning
    if (projectedValue > 11.0) {
        riskLevel = 'WATCHFUL';
        message = "Elevated glycemic projection detected.";
        advice = "Verify insulin active (IOB) and hydration levels.";
    }

    return {
        riskLevel,
        projectedValue,
        velocity: parseFloat(velocity.toFixed(2)),
        message,
        advice
    };
};
