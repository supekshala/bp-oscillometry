// From Rust models.rs
export interface User {
    id: number;
    username: string;
    name: string;
}

export interface BloodPressureReading {
    id: number;
    user_id: number;
    systolic: number;
    diastolic: number;
    pulse: number;
    notes: string | null;
    created_at: string;
}

export const mockUser: User = {
    id: 1,
    username: 'testuser',
    name: 'Test User',
};

export const mockReadings: BloodPressureReading[] = [
    {
        id: 1,
        user_id: 1,
        systolic: 118,
        diastolic: 78,
        pulse: 72,
        notes: 'Morning reading, feeling good.',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        user_id: 1,
        systolic: 125,
        diastolic: 81,
        pulse: 75,
        notes: 'After a large meal.',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        user_id: 1,
        systolic: 135,
        diastolic: 88,
        pulse: 80,
        notes: 'Feeling stressed.',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        user_id: 1,
        systolic: 142,
        diastolic: 92,
        pulse: 85,
        notes: 'After exercise.',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
];
