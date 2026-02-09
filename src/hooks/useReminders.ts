import { useState, useEffect } from 'react';

export interface Reminder {
    id: string;
    label: string;
    time: string; // HH:mm
    enabled: boolean;
    type: 'glucose' | 'medication' | 'bolus';
}

const STORAGE_KEY = 'diabetes_reminders';

export function useReminders() {
    const [reminders, setReminders] = useState<Reminder[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [
            { id: '1', label: 'Morning Glucose Check', time: '08:00', enabled: false, type: 'glucose' },
            { id: '2', label: 'Post-Lunch Bolus', time: '14:00', enabled: false, type: 'bolus' },
            { id: '3', label: 'Evening Medication', time: '20:00', enabled: false, type: 'medication' }
        ];
    });

    const [permission, setPermission] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    }, [reminders]);

    const requestPermission = async () => {
        if (typeof Notification === 'undefined') return;
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
    };

    const toggleReminder = (id: string) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, enabled: !r.enabled } : r
        ));
    };

    const updateReminderTime = (id: string, time: string) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, time } : r
        ));
    };

    // Notification Check Logic
    useEffect(() => {
        if (permission !== 'granted') return;

        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            reminders.forEach(reminder => {
                if (reminder.enabled && reminder.time === currentTime) {
                    // Check if we already notified in this minute
                    const lastNotified = localStorage.getItem(`notified_${reminder.id}`);
                    const today = now.toDateString();

                    if (lastNotified !== `${today}_${currentTime}`) {
                        new Notification('DiabetesCare Alert', {
                            body: `Time for your: ${reminder.label}`,
                            icon: '/pwa-192x192.png' // Change to actual icon path if available
                        });
                        localStorage.setItem(`notified_${reminder.id}`, `${today}_${currentTime}`);
                    }
                }
            });
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [reminders, permission]);

    return {
        reminders,
        permission,
        requestPermission,
        toggleReminder,
        updateReminderTime
    };
}
