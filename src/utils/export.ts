import type { HealthEntry } from '../hooks/useHealthData';

/**
 * Utility to export health data to CSV.
 */
export const exportToCSV = (data: HealthEntry[], filename: string) => {
    if (data.length === 0) return;

    const headers = ['Timestamp', 'Type', 'Value', 'Details'];
    const rows = data.map(entry => {
        const timestamp = entry.timestamp.toLocaleString();
        const type = entry.type;
        const value = entry.value || entry.carbs || '';
        const details = entry.names ? entry.names.join('; ') : (entry.units ? `${entry.units} units` : '');

        return [timestamp, type, value, `"${details}"`].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
