import type { HealthEntry } from '../hooks/useHealthData';

export type RiskLevel = 'STABLE' | 'WATCHFUL' | 'CRITICAL' | 'OPTIMAL';

export interface PredictionResult {
    riskLevel: RiskLevel;
    projectedValue: number;
    velocity: number; // mmol/L per hour
    messageKey: string;
    adviceKey: string;
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
            messageKey: "awaiting_calibration",
            adviceKey: "add_readings"
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
    let messageKey = "stability";
    let adviceKey = "equilibrum";

    if (latest.value >= 4.0 && latest.value <= 8.5) {
        riskLevel = 'OPTIMAL';
        messageKey = "equilibrum";
        adviceKey = "stability";
    }

    // Hypoglycemia prediction (The primary goal)
    if (projectedValue < 4.4) {
        riskLevel = 'WATCHFUL';
        messageKey = "approaching_threshold";
        adviceKey = "proactive_carb";
    }

    if (projectedValue < 3.9 || (velocity < -2 && latest.value < 6)) {
        riskLevel = 'CRITICAL';
        messageKey = "rapid_drop";
        adviceKey = "clinical_action";
    }

    // Hyperglycemia warning
    if (projectedValue > 11.0) {
        riskLevel = 'WATCHFUL';
        messageKey = "elevated_projection";
        adviceKey = "verify_iob";
    }

    return {
        riskLevel,
        projectedValue,
        velocity: parseFloat(velocity.toFixed(2)),
        messageKey,
        adviceKey
    };
};
